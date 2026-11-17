# 나인투자 사이트 편집 가이드

## 구조

- `index.html`: 메인 페이지 (첫 화면 오른쪽이 공지판)
- `pages/about/index.html`: 회사소개 (대표 인사말, 회사 개요, 일하는 원칙)
- `pages/business/index.html`: 사업영역
- `pages/service/index.html`: 서비스안내 (이용 절차, 문의 방법, 자주 묻는 질문)
- `pages/location/index.html`: 오시는 길
- `pages/news/index.html`: 공지사항 전체 목록 (제목을 누르면 내용이 펼쳐짐)
- `pages/reviews/index.html`: 고객후기 (현재는 게시된 후기 없음 안내)
- `admin/index.html`: 관리자 공지 작성 (주소로만 들어감, 메뉴에는 없음)
- `assets/css/style.css`: 전체 공통 스타일
- `assets/js/site.js`: 메뉴 활성 표시, 모바일 메뉴, 연도 표시
- `assets/js/notices.js`: 공지 불러와서 화면에 그리기
- `data/notices.json`: 공지 데이터
- `api/notices.js`: 공지 조회·저장 (Vercel 서버 함수)

## 공지 수정

- 관리자 페이지 `/admin/`에서 고정 공지와 새 공지를 쓰고 저장하면 됩니다. 설정은 `VERCEL_ENV.md` 참고.
- 직접 고칠 때는 `data/notices.json`의 `pinnedNotice.body`(고정 공지)와 `items`(목록, 위에 있을수록 최신)를 수정합니다.

## 자주 수정하는 곳

- 회사 정보(주소, 번호, 이메일): 각 페이지 맨 아래 푸터, `pages/about`의 회사 개요 표, `pages/location`의 기본 정보 표
- 머리글 대표번호: 각 페이지 상단 `header-tel`
- 메인 문구: `index.html`
- 번호는 모두 `0000` 형식으로 가려져 있습니다. 실제 값으로 바꿀 때는 전체 검색으로 한 번에 바꾸세요.

## 디자인 수정

- 색, 글자 크기, 간격, 모서리 값은 `assets/css/style.css` 맨 위 `:root`에 모여 있습니다.
- 글꼴은 SUIT Variable 하나만 씁니다 (각 페이지 `<head>`의 jsdelivr 링크).
- 사진은 쓰지 않습니다. 실제 사무실·팀 사진이 생기면 그때 추가하세요.
- 디자인 원칙은 `DESIGN.md`에 정리되어 있습니다.
