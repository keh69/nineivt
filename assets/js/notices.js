(() => {
  const pinnedBody = document.querySelector('[data-pinned-body]');
  const pinnedDate = document.querySelector('[data-pinned-date]');
  const listRoot = document.querySelector('[data-notice-list]');

  if (!pinnedBody && !listRoot) return;

  const clean = (s) => String(s ?? '').trim();

  const escapeHtml = (s) =>
    clean(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const formatDate = (s) => escapeHtml(s).replace(/-/g, '.');

  // 고정 공지의 "회원은 … 글을 쓸 수 없습니다" 문장은 굵게 보여 줍니다.
  const toParagraphs = (text) =>
    clean(text)
      .split(/\n+/g)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const isEm = /회원은.*글을\s*쓸\s*수\s*없습니다/.test(line);
        return `<p${isEm ? ' class="is-em"' : ''}>${escapeHtml(line)}</p>`;
      })
      .join('');

  const fetchNotices = async () => {
    // Vercel 배포에서는 /api/notices, 로컬 확인 시에는 data/notices.json을 읽습니다.
    const base = listRoot?.dataset.base || pinnedBody?.dataset.base || './';
    const tryUrls = ['/api/notices', `${base}data/notices.json`];
    let lastErr = null;

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr ?? new Error('notice fetch failed');
  };

  const firstLine = (text) => clean(text).split('\n')[0] ?? '';

  const renderLinks = (items, href) =>
    items
      .map((it, idx) => {
        const num = items.total - idx;
        const target = `${href}#${encodeURIComponent(clean(it.id))}`;
        return `
          <li>
            <a class="board__row" href="${target}">
              <span class="board__num">${num}</span>
              <span class="board__title">${escapeHtml(it.title)}
                <span class="board__summary">${escapeHtml(firstLine(it.content))}</span>
              </span>
              <span class="board__date">${formatDate(it.date)}</span>
            </a>
          </li>`;
      })
      .join('');

  const renderFull = (items) =>
    items
      .map((it, idx) => {
        const num = items.total - idx;
        return `
          <li>
            <details id="${escapeHtml(it.id)}">
              <summary class="board__row">
                <span class="board__num">${num}</span>
                <span class="board__title">${escapeHtml(it.title)}</span>
                <span class="board__date">${formatDate(it.date)}</span>
              </summary>
              <div class="board__content">${escapeHtml(it.content)}</div>
            </details>
          </li>`;
      })
      .join('');

  const render = (data) => {
    if (pinnedBody && data?.pinnedNotice?.body) {
      pinnedBody.innerHTML = toParagraphs(data.pinnedNotice.body);
    }
    if (pinnedDate && data?.pinnedNotice?.updatedAt) {
      pinnedDate.textContent = `고정 공지 ${formatDate(data.pinnedNotice.updatedAt)} 수정`;
    }

    if (!listRoot) return;

    const all = Array.isArray(data?.items) ? data.items : [];
    if (!all.length) {
      listRoot.innerHTML = '<li class="board__empty">등록된 공지가 없습니다.</li>';
      return;
    }

    const limit = Number(listRoot.dataset.limit) || all.length;
    const items = all.slice(0, limit);
    items.total = all.length;

    if (listRoot.dataset.mode === 'full') {
      listRoot.innerHTML = renderFull(items);
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const opened = hash && document.getElementById(hash);
      if (opened && opened.tagName === 'DETAILS') {
        opened.open = true;
        opened.scrollIntoView();
      }
    } else {
      listRoot.innerHTML = renderLinks(items, listRoot.dataset.href || './pages/news/index.html');
    }
  };

  fetchNotices()
    .then(render)
    .catch(() => {
      if (listRoot) {
        listRoot.innerHTML =
          '<li class="board__empty">공지를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</li>';
      }
      if (pinnedBody) {
        pinnedBody.innerHTML =
          '<p>자본시장법에 따라 유사투자자문업은 양방향 소통을 이용한 영업이 허용되지 않습니다. 회원은 본 홈페이지에 글을 쓸 수 없습니다.</p>';
      }
    });
})();
