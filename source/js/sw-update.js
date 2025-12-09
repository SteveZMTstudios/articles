/* sw-update: detect service worker updates and prompt user */
(function(){
  if(!('serviceWorker' in navigator)) return;

  var SW_URL = '/service-worker.js';
  var STORAGE_KEY = 'sw_hash_v1';
  var CHECK_TIMEOUT_MS = 15000; // fallback controllerchange timeout

  function log(){ try{ console.log.apply(console, ['[sw-update]'].concat([].slice.call(arguments))); }catch(e){} }

  function sha256Hex(text){
    try {
      var enc = new TextEncoder();
      return crypto.subtle.digest('SHA-256', enc.encode(text)).then(function(buf){
        return Array.prototype.map.call(new Uint8Array(buf), function(x){ return ('00'+x.toString(16)).slice(-2); }).join('');
      });
    } catch(e){ return Promise.resolve(''); }
  }

  function fetchHash(){
    return fetch(SW_URL + '?_=' + Date.now(), { cache: 'no-store' })
      .then(function(resp){ if(!resp.ok) throw new Error('network '+resp.status); return resp.text(); })
      .then(function(text){ return sha256Hex(text); })
      .catch(function(err){ log('fetchHash error', err); return null; });
  }

  function showPrompt(){
    if(window.__sw_update_prompt_shown) return; window.__sw_update_prompt_shown = true;
    var action = function(){ triggerSkipWaiting(); };
    try {
      if(window.mdui && mdui.snackbar){
        mdui.snackbar({
          message: '<i class="mdui-icon material-icons">offline_pin</i> 发现站点更新，请重新载入应用更新。',
          buttonText: '刷新',
          timeout: 0,
          position: 'right-top',
          onButtonClick: action
        });
      } else if(confirm('发现站点更新，是否刷新以获取最新内容？')) {
        action();
      }
    } catch(e){ if(confirm('发现站点更新，是否刷新以获取最新内容？')) action(); }
  }

  function triggerSkipWaiting(){
    navigator.serviceWorker.getRegistration().then(function(reg){
      if(!reg){ location.reload(); return; }
      if(reg.waiting){
        reg.waiting.postMessage('SKIP_WAITING');
      } else if(reg.installing){
        // wait for it to become waiting
        var installing = reg.installing;
        installing.addEventListener('statechange', function(){
          if(installing.state === 'installed' && reg.waiting){
            reg.waiting.postMessage('SKIP_WAITING');
          }
        });
      }
      var reloaded = false;
      var reloadIfNeeded = function(){
        if(reloaded) return; reloaded = true;
        location.reload();
      };
      navigator.serviceWorker.addEventListener('controllerchange', reloadIfNeeded);
      setTimeout(reloadIfNeeded, CHECK_TIMEOUT_MS); // fallback
    });
  }

  function runHashCheck(){
    fetchHash().then(function(hash){
      if(!hash) return; // skip if failed
      var prev = localStorage.getItem(STORAGE_KEY);
      if(prev && prev !== hash){
        log('hash changed', prev, '=>', hash);
        navigator.serviceWorker.getRegistration().then(function(reg){
          if(!reg){
            // 没有 registration，直接提示（少见）
            showPrompt();
            return;
          }
          if(reg.waiting){
            // 正常等待 -> 提示
            showPrompt();
            return;
          }
          // 若 skipWaiting=true，新 SW 很可能已经直接 active，没有 waiting
            // 判断 active 的 scriptURL 是否不同（粗略：hash 已变化基本可认为不同）
          if(reg.active && !reg.waiting){
            // 直接提示让用户刷新（可立即获取最新 precache）
            showPrompt();
            return;
          }
          // 尝试触发 update 再次检查（兼容部分浏览器延迟）
          if(reg.update){
            reg.update().then(function(){
              if(reg.waiting){
                showPrompt();
              } else if(reg.active){
                showPrompt();
              }
            });
          }
        });
      }
      localStorage.setItem(STORAGE_KEY, hash);
    });
  }

  // Listen to updatefound to show prompt earlier
  function listenRegistration(reg){
    if(!reg) return;
    if(reg.installing){ attachStateListener(reg.installing, reg); }
    reg.addEventListener('updatefound', function(){
      var nw = reg.installing; if(nw) attachStateListener(nw, reg);
    });
  }
  function attachStateListener(worker, reg){
    worker.addEventListener('statechange', function(){
      if(worker.state === 'installed' && navigator.serviceWorker.controller){
        // new content available
        showPrompt();
      }
    });
  }

  // Register listener once ready
  navigator.serviceWorker.ready.then(function(reg){ listenRegistration(reg); });

  // Delay hash check until window load for best chance of fresh SW fetch
  if(document.readyState === 'complete') runHashCheck();
  else window.addEventListener('load', runHashCheck);

  // Add PJAX support
  document.addEventListener('page:updated', function() {
    setTimeout(runHashCheck, 1000);
  });

  // expose a manual trigger only for debugging
  try { window.__forceSwHashCheck = runHashCheck; } catch(e){}

})();