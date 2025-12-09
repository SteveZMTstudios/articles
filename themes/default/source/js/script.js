var $$ = mdui.$;

/* Gotop */
$$(function () {
  $$(window).on('scroll', function (e) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
      $$('#gotop').removeClass('mdui-fab-hide');
    } else {
      $$('#gotop').addClass('mdui-fab-hide');
    }
  });
  $$('#gotop').on('click', function (e) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* Dark Mode */
$$(function () {
  var mode = localStorage.getItem('theme-mode') || 'auto';
  var body = $$('body');
  var btn = $$('#theme-toggle');
  var icon = btn.find('i');

  function applyTheme() {
    var isDark = false;
    if (mode === 'auto') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      icon.text('brightness_auto');
    } else if (mode === 'light') {
      isDark = false;
      icon.text('brightness_7');
    } else if (mode === 'dark') {
      isDark = true;
      icon.text('brightness_3');
    }

    if (isDark) {
      body.addClass('mdui-theme-layout-dark');
    } else {
      body.removeClass('mdui-theme-layout-dark');
    }
  }

  // Initial application
  applyTheme();

  btn.on('click', function () {
    if (mode === 'auto') mode = 'light';
    else if (mode === 'light') mode = 'dark';
    else mode = 'auto';
    
    localStorage.setItem('theme-mode', mode);
    applyTheme();
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (mode === 'auto') applyTheme();
    });
  }
});

/* Drawer State */
$$(function () {
  $$('#sidebar').on('open.mdui.drawer', function (e) {
    localStorage.removeItem('mdui-drawer-close');
  });
  $$('#sidebar').on('close.mdui.drawer', function (e) {
    localStorage.setItem('mdui-drawer-close', true);
  });
});

/* Sidebar Collapse Item State */
$$(function () {
  $$('.mdui-collapse-item').eq(0).on('close.mdui.collapse', function (e) {
    localStorage.removeItem('mdui-collapse-item-0');
  });
  $$('.mdui-collapse-item').eq(0).on('open.mdui.collapse', function (e) {
    localStorage.setItem('mdui-collapse-item-0', true);
  });
  $$('.mdui-collapse-item').eq(1).on('close.mdui.collapse', function (e) {
    localStorage.removeItem('mdui-collapse-item-1');
  });
  $$('.mdui-collapse-item').eq(1).on('open.mdui.collapse', function (e) {
    localStorage.setItem('mdui-collapse-item-1', true);
  });
  $$('.mdui-collapse-item').eq(2).on('close.mdui.collapse', function (e) {
    localStorage.removeItem('mdui-collapse-item-2');
  });
  $$('.mdui-collapse-item').eq(2).on('open.mdui.collapse', function (e) {
    localStorage.setItem('mdui-collapse-item-2', true);
  });
  $$('.mdui-collapse-item').eq(3).on('close.mdui.collapse', function (e) {
    localStorage.removeItem('mdui-collapse-item-3');
  });
  $$('.mdui-collapse-item').eq(3).on('open.mdui.collapse', function (e) {
    localStorage.setItem('mdui-collapse-item-3', true);
  });
});

/* Search */
var searchFunc = function (path, search_id, content_id) {
  $$.ajax({
    url: path,
    dataType: 'xml',
    success: function (xmlResponse) {
      var datas = $$(xmlResponse).map(function () {
        return this.tagName === 'SEARCH' ? this : null;
      }).find('entry').map(function () {
        return {
          title: $$(this).find('title').text(),
          content: $$(this).find('content').text(),
          url: $$(this).find('url').text()
        };
      }).get();
      var $input = $$(search_id)[0];
      var $resultContent = $$(content_id)[0];
      $input.addEventListener('input', function () {
        var str = '<ul class="search-result-list">';
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = '';
        if (this.value.trim().length <= 0) {
          return;
        }
        datas.forEach(function (data) {
          var isMatch = true;
          if (!data.title || data.title.trim() === '') {
            data.title = 'Untitled';
          }
          var orig_data_title = data.title.trim();
          var data_title = orig_data_title.toLowerCase();
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, '');
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);
              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
              }
            });
          } else {
            isMatch = false;
          }
          if (isMatch) {
            str += '<li><a href="' + data_url + '" class="search-result-title" target="_blank">' + orig_data_title + '</a>';
            var content = orig_data_content;
            if (first_occur >= 0) {
              var start = first_occur - 20;
              var end = first_occur + 80;
              if (start < 0) {
                start = 0;
              }
              if (start == 0) {
                end = 100;
              }
              if (end > content.length) {
                end = content.length;
              }
              var match_content = content.substr(start, end);
              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, 'gi');
                match_content = match_content.replace(regS, '<em class="search-result-keyword">$&</em>');
              });
              str += '<p class="search-result-content">' + match_content + '...</p>';
            }
            str += '</li>';
          }
        });
        str += '</ul>';
        $resultContent.innerHTML = str;
      });
    }
  });
};
$$(function () {
  var ele = $$('#search .search-form-input')[0];
  $$('#search').on('opened.mdui.dialog', function (e) {
    ele.focus();
  });
  $$(document).on('click', function (e) {
    if ($$(e.target).closest('#search').length <= 0) {
      $$('.search-form-input').val('');
      $$('.search-result').html('');
    }
  });
  var resource = $$('.search-result').attr('data-resource');
  if (resource) searchFunc(resource, '.search-form-input', '.search-result');
});

/* Utils */
function __normalizeGitalkId(raw) {
  try {
    if (!raw) raw = location.pathname;
    if (/^https?:\/\//i.test(raw)) {
      var u = new URL(raw, window.location.origin);
      raw = u.pathname || '/';
    }
    try { raw = decodeURI(raw); } catch (e) {}
    raw = raw.replace(/index\.html$/i, '');
    if (raw && raw.charAt(0) !== '/') raw = '/' + raw;
    if (raw.length > 1 && raw.endsWith('/')) raw = raw.slice(0, -1);
    return raw || '/';
  } catch (e) {
    return (window.location && window.location.pathname) || '/';
  }
}

function initGitalk() {
  if (!window.Gitalk) return;
  var el = document.getElementById('gitalk-container');
  if (!el) return;
  var config = window.GITALK_CONFIG || {};
  if (!config.repo || !config.owner) {
    if (window.theme && window.theme.comment) {
      config = Object.assign({}, window.theme.comment);
    }
  }
  try {
    config.id = __normalizeGitalkId(config.id || (window.location && window.location.pathname));
  } catch (e) {}
  if (!config.repo || !config.owner) {
    el.innerHTML = '<div style="color:red">Gitalk 配置错误: repo/owner 未设置</div>';
    return;
  }
  el.innerHTML = '';
  var gitalk = new Gitalk(config);
  gitalk.render('gitalk-container');
  window.GITALK_CONFIG = config;
}

function reinitPageComponents() {
  if (typeof window.initNoticeSystem === 'function') {
    try {
      window.initNoticeSystem();
    } catch (e) {
      console.warn('NoticeSystem reinit error:', e);
    }
  }
  // Busuanzi
  if (window.BUSUANZI_SRC) {
    var oldScript = document.querySelector('script[src="' + window.BUSUANZI_SRC + '"]');
    if (oldScript) oldScript.remove();
    var script = document.createElement('script');
    script.src = window.BUSUANZI_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }
  // Donate
  if (document.getElementById('donate')) {
    var tab = new mdui.Tab('#donate .mdui-tab');
    $$('#donate').on('opened.mdui.dialog', function (e) {
      tab.handleUpdate();
    });
  }
  if (window.GITALK_SRC && document.getElementById('gitalk-container')) {
    if (typeof Gitalk === 'undefined') {
      var script = document.createElement('script');
      script.src = window.GITALK_SRC;
      script.onload = function() {
        setTimeout(initGitalk, 100);
      };
      document.body.appendChild(script);
    } else {
      setTimeout(initGitalk, 100);
    }
  }
  try { fixMduiDialogs(); fixFixedElements(); } catch(e) {}
}
window.reinitPageComponents = reinitPageComponents;

$$(function() {
  reinitPageComponents();
});

function fixMduiDialogs() {
  document.querySelectorAll('[mdui-dialog]').forEach(function(el) {
    try {
      if (el.dataset.dialogBound === '1') return;

      var dialogTarget = el.getAttribute('mdui-dialog') || '';
      var dialogId = '';

      try {
        var match = /target\s*:\s*['"]#?([^'"]+)['"]/i.exec(dialogTarget);
        if (match && match[1]) dialogId = match[1];
        else if (dialogTarget && dialogTarget.startsWith('#')) dialogId = dialogTarget.substring(1);
      } catch(e) {}

      if (!dialogId) return;

      var handler = function(e){
        try {
          e.preventDefault();
          e.stopPropagation();
        } catch(_) {}
        var dialog = document.getElementById(dialogId);
        if (dialog && dialog.parentNode !== document.body) {
          try { document.body.appendChild(dialog); } catch(_) {}
        }
        if (dialog && window.mdui && mdui.Dialog) {
          try {
            var inst = new mdui.Dialog(dialog, { history: false });
            inst.open();
          } catch(_) {}
        }
        return false;
      };

      el.__mduiDialogHandler = handler;
      el.addEventListener('click', handler, false);
      el.dataset.dialogBound = '1';
    } catch (e) { /* noop */ }
  });
}

function fixFixedElements() {
  try {
    var ids = ['toc'];
    ids.forEach(function(id) {
      var moved = document.querySelector('[data-fixed-wrapper-id="' + id + '"]');
      var newEl = document.querySelector('#main #' + id);

      if (moved && !newEl) {
        try { moved.setAttribute('data-fixed-hidden', 'true'); moved.style.display = 'none'; } catch(e) { }
      }

      if (moved && newEl) {
        var newWrapper = newEl.closest('div');
        if (newWrapper && moved !== newWrapper) {
          try { moved.setAttribute('data-fixed-hidden', 'true'); moved.style.display = 'none'; } catch(e) { }
          moved = null;
        }
      }

      if (newEl) {
        var wrapper = newEl.closest('div');
          if (wrapper) {
            var pos = '';
            try { pos = getComputedStyle(wrapper).position || wrapper.style.position; } catch(e) {}
            if (pos === 'fixed' && wrapper.parentNode !== document.body) {
              wrapper.setAttribute('data-fixed-wrapper-id', id);
              wrapper.removeAttribute('data-fixed-hidden');
              wrapper.style.display = '';
              document.body.appendChild(wrapper);
            } else if (pos === 'fixed' && wrapper.parentNode === document.body) {
              if (!wrapper.hasAttribute('data-fixed-wrapper-id')) wrapper.setAttribute('data-fixed-wrapper-id', id);
              wrapper.removeAttribute('data-fixed-hidden');
              wrapper.style.display = '';
            }
            try { if (window.mdui && typeof mdui.mutation === 'function') mdui.mutation(); } catch(e) {}
          }
      }
    });

    document.querySelectorAll('[data-fixed-wrapper-id]').forEach(function(w) {
      var id = w.getAttribute('data-fixed-wrapper-id');
      if (id && !document.querySelector('#main #' + id)) {
        try { w.setAttribute('data-fixed-hidden', 'true'); w.style.display = 'none'; } catch(e) {}
      }
    });
  } catch (e) {
    console.warn('fixFixedElements error:', e);
  }
}
