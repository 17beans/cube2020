# [앱_미완성]_Cube

문제은행 프로그램(cs)의 모바일 커뮤니티 앱



# Cube 앱은...

학교/학원/과외 선생님들이 수학문제 제작에 있어 편리함을 제공하는 문제은행 프로그램에 대한 편리한 운영을 위한 플랫폼으로 QnA, 메뉴얼, 사용 팁 ,공지사항 등 사용자들 간의 커뮤니케이션을 위한 Android 및 IOS 앱이다.



# 프로젝트 형태

- 개인 프로젝트



# 사용한 기술 스택

- React Native(0.63.4) Without Expo (react-native-cli)
- MSSQL(MS SQL Server)
- Apache
- Python(Flask)



# UI 및 기능 구현

- 당근 마켓, 중고나라 등의 앱을 벤치마킹하여 소비자 입장에서 가장 편한 UI가 무엇일지 고민하였고 심플한 디자인을 추구함
- 로그인과 관련된 기능은 MSSQL을 통해 DB에서 회원 정보를 조회하여 이루어지도록 구현
- 글 업로드 시 글은 MSSQL Server의 DB에, 이미지는 Python Flask를 이용하여 POST로 Apach 서버에 저장하고, Apache 서버의 이미지 URL을 DB에 넣어 글을 조회할 때 이미지 볼 수 있도록 구현



전체 앱 화면
[image]

# 현재 어느 수준까지 개발이 되어있는가
화면
[image]

이메일 형식 오류
화면
[image]

자동 로그인 및 로그아웃
화면
[image]

글과 이미지 업로드
화면
[image]

댓글 등록과 삭제
화면
[image]

외부로 글 공유
화면
[image]

글 수정 및 삭제
화면
[image]

무한 스크롤
화면
[image]

당겨서 새로고침
화면
[image]

구독 했을 경우와 구독하지 않았을 경우화면
[image]

# 그 외 구현된 기능

- 로그아웃

# 향후 계획

- 현재는 로그인 시 인증 서버를 따로 두지 않고 DB에서 바로 회원 정보를 확인하여 안전하지 않은 상태의 통신이 이루어지고 있다. 향후 로그인과 관련하여 인증 서버를 구축하거나 외부 로그인(카카오톡, 구글 등)을 이용하여 토큰을 통한 안전한 로그인 시스템을 갖출 계획이다.
- Python Flask를 이용한 Apache와의 통신에서 https 통신에 어려움이 있어 현재는 http로 구현되어 있는데 https로 보안이 적용된 통신을 구현할 계획이다.
