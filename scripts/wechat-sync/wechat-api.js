'use strict';

/**
 * 微信公众号 API 客户端
 * 
 * 功能：
 * - 获取和刷新 access_token（带缓存和刷新机制）
 * - 上传图片到永久素材库
 * - 新增图文草稿
 * - 错误诊断与恢复
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

class WeChatAPIClient {
  constructor(config) {
    this.appid = config.appid;
    this.appsecret = config.appsecret;
    this.baseDir = config.baseDir || process.cwd();
    this.tokenCacheFile = path.join(this.baseDir, '.github', 'wechat-token-cache.json');
    this.logger = config.logger || console;
    this.timeout = config.timeout || 30000;
    
    this.tokenCache = this._loadTokenCache();
  }

  /**
   * 获取 access_token（支持缓存和自动刷新）
   */
  async getAccessToken() {
    // 检查缓存中的 token 是否有效
    if (this.tokenCache.token && this.tokenCache.expires_at > Date.now()) {
      this.logger.info('[WeChat API] Using cached access_token');
      return this.tokenCache.token;
    }

    this.logger.info('[WeChat API] Fetching new access_token from WeChat API');
    
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.appsecret}`;
    
    try {
      const result = await this._httpGet(url);
      
      if (result.errcode) {
        throw new WeChatAPIError(
          `Failed to get access_token: ${result.errmsg}`,
          result.errcode
        );
      }

      // 缓存 token（提前 5 分钟刷新）
      this.tokenCache = {
        token: result.access_token,
        expires_at: Date.now() + (result.expires_in - 300) * 1000,
        fetched_at: new Date().toISOString(),
      };
      
      this._saveTokenCache();
      return result.access_token;
    } catch (err) {
      if (err instanceof WeChatAPIError) {
        throw err;
      }
      throw new WeChatAPIError(`Failed to fetch access_token: ${err.message}`);
    }
  }

  /**
   * 上传图片到永久素材库（图文消息配图）
   */
  async uploadImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;
    
    try {
      const fileBuffer = fs.readFileSync(imagePath);
      const result = await this._httpPost(url, fileBuffer, {
        'Content-Type': 'image/jpeg',
      });

      if (result.errcode) {
        throw new WeChatAPIError(
          `Failed to upload image: ${result.errmsg}`,
          result.errcode
        );
      }

      // 返回媒体 ID，可用于草稿中的图文消息
      return {
        media_id: result.media_id,
        thumb_media_id: result.thumb_media_id,
      };
    } catch (err) {
      if (err instanceof WeChatAPIError) {
        throw err;
      }
      throw new WeChatAPIError(`Failed to upload image: ${err.message}`);
    }
  }

  /**
   * 上传图文内容中的图片（用于草稿正文中的图片）
   */
  async uploadContentImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${token}`;
    
    try {
      const fileBuffer = fs.readFileSync(imagePath);
      const result = await this._httpPost(url, fileBuffer, {
        'Content-Type': 'image/jpeg',
      });

      if (result.errcode) {
        throw new WeChatAPIError(
          `Failed to upload content image: ${result.errmsg}`,
          result.errcode
        );
      }

      // 返回图片 URL，可直接用于 HTML 中的 <img src>
      return result.image_url;
    } catch (err) {
      if (err instanceof WeChatAPIError) {
        throw err;
      }
      throw new WeChatAPIError(`Failed to upload content image: ${err.message}`);
    }
  }

  /**
   * 新增图文草稿
   */
  async addDraft(draft) {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`;
    
    try {
      const result = await this._httpPostJSON(url, {
        articles: [draft], // draft_item 结构：title, author, digest, show_cover_pic, content, content_source_url
      });

      if (result.errcode) {
        throw new WeChatAPIError(
          `Failed to add draft: ${result.errmsg}`,
          result.errcode
        );
      }

      return {
        media_id: result.media_id,
      };
    } catch (err) {
      if (err instanceof WeChatAPIError) {
        throw err;
      }
      throw new WeChatAPIError(`Failed to add draft: ${err.message}`);
    }
  }

  /**
   * 获取草稿总数
   */
  async getDraftCount() {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/count?access_token=${token}`;
    
    try {
      const result = await this._httpGet(url);

      if (result.errcode) {
        throw new WeChatAPIError(
          `Failed to get draft count: ${result.errmsg}`,
          result.errcode
        );
      }

      return result.item_count;
    } catch (err) {
      if (err instanceof WeChatAPIError) {
        throw err;
      }
      throw new WeChatAPIError(`Failed to get draft count: ${err.message}`);
    }
  }

  /**
   * 诊断：测试 API 可用性
   */
  async diagnose() {
    const result = {
      token_ok: false,
      draft_api_ok: false,
      errors: [],
    };

    try {
      const token = await this.getAccessToken();
      result.token_ok = true;
      result.token_expires_in = Math.round((this.tokenCache.expires_at - Date.now()) / 1000);
    } catch (err) {
      result.errors.push(`Token error: ${err.message} (code: ${err.errcode})`);
      if (err.errcode === 61004) {
        result.errors.push('>> IP 白名单配置失败，请检查微信开发者平台的 IP 白名单设置或启用"风险调用确认"');
      } else if (err.errcode === 40001) {
        result.errors.push('>> AppSecret 配置错误或已过期，请检查 Secrets 配置');
      }
    }

    if (result.token_ok) {
      try {
        await this.getDraftCount();
        result.draft_api_ok = true;
      } catch (err) {
        result.errors.push(`Draft API error: ${err.message}`);
      }
    }

    return result;
  }

  // ========== Private Methods ==========

  /**
   * HTTP GET 请求（JSON 响应）
   */
  _httpGet(url) {
    return new Promise((resolve, reject) => {
      https.get(url, { timeout: this.timeout }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        });
      }).on('error', reject).on('timeout', function() {
        this.destroy();
        reject(new Error(`Request timeout (${this.timeout}ms)`));
      });
    });
  }

  /**
   * HTTP POST 请求（二进制数据，JSON 响应）
   */
  _httpPost(url, data, headers = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
        timeout: this.timeout,
      };

      const req = https.request(options, (res) => {
        let response = '';
        res.on('data', chunk => { response += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(response));
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${response}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout (${this.timeout}ms)`));
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * HTTP POST 请求（JSON 数据，JSON 响应）
   */
  _httpPostJSON(url, data) {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.stringify(data);
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(jsonData),
        },
        timeout: this.timeout,
      };

      const req = https.request(options, (res) => {
        let response = '';
        res.on('data', chunk => { response += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(response));
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${response}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout (${this.timeout}ms)`));
      });

      req.write(jsonData);
      req.end();
    });
  }

  _loadTokenCache() {
    if (fs.existsSync(this.tokenCacheFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.tokenCacheFile, 'utf8'));
      } catch (e) {
        this.logger.warn('[WeChat API] Failed to load token cache:', e.message);
      }
    }
    return { token: null, expires_at: 0 };
  }

  _saveTokenCache() {
    const dir = path.dirname(this.tokenCacheFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.tokenCacheFile, JSON.stringify(this.tokenCache), 'utf8');
  }
}

/**
 * 微信 API 错误类
 */
class WeChatAPIError extends Error {
  constructor(message, errcode) {
    super(message);
    this.name = 'WeChatAPIError';
    this.errcode = errcode;
  }
}

module.exports = { WeChatAPIClient, WeChatAPIError };
