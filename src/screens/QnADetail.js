import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  TextInput,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MSSQL from 'react-native-mssql';
import BtnLikeQnA from '../components/BtnLikeQnA';
import glovar from '../components/glovar';
// import ImageCollection from '../components/ImageCollection'
import ImageSliderQnA from '../components/ImageSliderQnA';
import BtnDelReplyQnA from '../components/BtnDelReplyQnA';
import {useDispatch, useSelector} from 'react-redux';

const config = {
  server: '211.219.52.31', //ip address of the mssql database
  username: 'cube2020', //username to login to the database
  password: 'cube2020', //password to login to the database
  database: 'cube2020', //the name of the database to connect to
  port: 1433, //OPTIONAL, port of the database on the server
  timeout: 5, //OPTIONAL, login timeout for the server
};
// const connected = MSSQL.connect(config);

export default function QnADetail({navigation, route}) {
  // useDispatch, useSelector import하기
  const dispatch = useDispatch();

  const logininfo = useSelector((state) => state.allStore.logininfo);
  const lastQnADetail = useSelector((state) => state.allStore.lastQnADetail);
  const QnAP_idx = useSelector((state) => state.allStore.QnA_P_idx);

  const [reply, setreply] = useState();
  const [replys, setreplys] = useState();
  // let newReplyCnt = 0
  const [newReplyCnt, setnewReplyCnt] = useState(0);
  let likecnt;

  const callreply = async () => {
    const connected = await MSSQL.connect(config);
    const query = `SELECT Idx, [desc], name, email, date, thumbnail FROM QnA WHERE (((QnA.P_idx)=${Number(
      QnAP_idx,
    )})) ORDER BY Idx;`;
    const result = await MSSQL.executeQuery(query);

    // const query2 = `SELECT Idx, Count(*) AS Reply_cnt2 FROM QnA GROUP BY Idx, Reply_chk, P_idx HAVING Reply_chk=1 AND P_idx=${Number(QnAP_idx)};`
    // const result2 = await MSSQL.executeQuery(query2);

    // // console.log("QnADetail_query2 ======================");
    // // console.log("query2: \n" + query2);
    // // console.log("========================================");

    // const query3 = `UPDATE QnA SET Reply_cnt=${Number(result2.length)} WHERE [Idx] = ${QnAP_idx}`
    // const result3 = MSSQL.executeQuery(query3);

    const query2 = `SELECT Count(*) AS Reply_cnt2 FROM QnA WHERE P_idx=${QnAP_idx}`;
    const result2 = await MSSQL.executeQuery(query2);

    setreplys(result);
    // newReplyCnt = result2[0].Reply_cnt2
    setnewReplyCnt(result2[0].Reply_cnt2);
    // // FlatList 새로고침 관련
    // setrefresh(false)

    console.log('========================================');
    console.log('QnADetail_callreply()');
    console.log('========================================');
    console.log('result(댓글들) ' + JSON.stringify(result));
    // console.log("QnAP_idx: " + QnAP_idx);
    // console.log("result2 " + JSON.stringify(result2[0].Reply_cnt2));
    // console.log("newReplyCnt: " + newReplyCnt);    // QnADetail가 실행될 때 callreply()에서 별도로 불러온 댓글 갯수
    console.log(
      '댓글이 없는 경우 아래에 callreply 함수에 대한 executeQuery 오류가 발생할 수 있습니다.',
    );
    console.log('========================================');
    // const closed = MSSQL.close();

    // const query2 = `SELECT Idx, Count(*) AS Reply_cnt2 FROM QnA GROUP BY Idx, Reply_chk, P_idx HAVING Reply_chk=1 AND P_idx=${Number(QnAP_idx)};`
    // const result2 = await MSSQL.executeQuery(query2);
    // console.log("query2: \n" + query2);

    // glovar.Reply_cnt = result2.length

    // const query2 = `SELECT Count(*) AS Reply_cnt2 FROM QnA GROUP BY Reply_chk, P_idx HAVING Reply_chk=1 AND P_idx=${QnAP_idx};`
    // const result2 = await MSSQL.executeQuery(query2);
    // console.log("쿼리는 정상인데");
    // console.log("query2: \n" + query2);

    // console.log("응답이 안옴 (HAVING / GROUP BY 때문인지 응답이 정상이 아니었던 것. 갯수는 .length로 셀 수 있음)");
    // console.log("댓글수는 " + result2);
  };

  const spldate = (date) => {
    const newdate = date.split('.');
    const newdate2 = newdate[0].split(':');
    return newdate2[0] + ':' + newdate2[1];
  };

  const [data, setdata] = useState({
    idx: '',
    category: '',
    title: '데이터 불러오는 중...',
    img: '',
    desc: '',
    date: '',
  });
  likecnt = data.Like_cnt;

  const Replydatachk = () => {
    // 댓글창에 데이터 입력하기 전에는 완료 버튼 비활성화 시키기
    if (reply === undefined) {
      return (
        <View style={styles.btnreplyinactive}>
          <Text style={styles.btnreplytext}>완료</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.btnreply}
          onPress={() => {
            upreply();
          }}>
          <Text style={styles.btnreplytext}>완료</Text>
        </TouchableOpacity>
      );
    }
  };

  const upreply = async () => {
    if (reply === '') {
      Alert.alert('', '댓글을 입력해 주세요!');
    } else {
      Keyboard.dismiss();

      Alert.alert('', '댓글을 작성했습니다!');

      const query = `INSERT INTO QnA (email, name, [desc], Reply_chk, P_idx) VALUES('${String(
        logininfo.email,
      )}', '${String(logininfo.name)}', '${String(reply)}', 1, ${Number(
        QnAP_idx,
      )})`;

      const query2 = `UPDATE QnA SET Reply_cnt=Reply_cnt+1 WHERE Idx=${lastQnADetail.idx}`;

      // navigation.goBack()
      // navigation.navigate('QnADetail', {item:lastQnADetail})
      navigation.replace('QnADetail', {item: lastQnADetail});

      console.log('========================================');
      console.log('QnADetail_upreply');
      console.log('========================================');
      console.log('logininfo.email: ' + logininfo.email);
      console.log('logininfo.name: ' + logininfo.name);
      console.log('reply.value: ' + reply.value);
      console.log('replys: ' + replys);
      console.log('========================================');

      const result1 = MSSQL.executeQuery(query);
      const result2 = MSSQL.executeQuery(query2);
    }
  };

  const images = String(data.Media1).split(','); // 변경된 부분

  useEffect(() => {
    const {item} = route.params;
    setdata(item);
    callreply();
    // console.log("QnADetail_useEffect ===================");
    // console.log("lastQnADetail.thumbnail: " + lastQnADetail.thumbnail);
    // console.log("========================================");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.textContainer}>
          <Text style={styles.titledesc}>{data.title}</Text>
          <View style={styles.cnt}>
            <Text style={styles.viewcnt}>{'조회수 ' + data.View_cnt}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.textContainer2}>
            <Text style={styles.desc}>{data.desc}</Text>
          </View>
          <ImageSliderQnA images={images} />
          {/* <ScrollView style={styles.imgscroll} horizontal={true}>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>1/8</Text>
                                <ImageModal style={styles.image}
                                    source={{uri:data.thumbnail}}
                                    resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>2/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>3/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>4/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>5/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>6/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>7/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                            <View style={styles.imgwrap}>
                                <Text style={styles.imgcnt}>8/8</Text>
                                <ImageModal style={styles.image} source={{uri:data.thumbnail}} resizeMode={"contain"}/>
                            </View>
                        </ScrollView> */}
        </View>
        <View>
          <View style={styles.cntReplyLike}>
            <View style={styles.replycnt}>
              <Image
                source={require('../assets/chat.png')}
                style={styles.replyimg}></Image>
              {/* <Text style={styles.replycnttext}>{'댓글수 ' + data.Reply_cnt}</Text> */}

              <Text style={styles.replycnttext}>{'댓글수 ' + newReplyCnt}</Text>
              {/** 보다 정확한 댓글 갯수 불러오기를 위해 QnADetail를 실행할 때 callreply() 부분에서 댓글 갯수를 newReplyCnt라는 변수에 따로 불러옴 */}
            </View>

            <View style={styles.cnt2}>
              <BtnLikeQnA style={styles.BtnLike} likecnt={likecnt} />
            </View>
          </View>
        </View>

        <FlatList
          style={styles.replyslist}
          data={replys}
          renderItem={({item}) => (
            <View style={styles.replyscontainer}>
              <View style={styles.replysname}>
                <Text style={styles.replysnametxt}>{item.name}</Text>
              </View>

              <View style={styles.replysdesc}>
                <Text style={styles.replysdesctxt}>{item.desc}</Text>
              </View>

              <View style={styles.dateNbtns}>
                <View style={styles.replysdate}>
                  <Text style={styles.replysdatetxt}>{spldate(item.date)}</Text>
                </View>

                {/* <TouchableOpacity style={styles.btneditNdelNreply}>
                                    <Text style={styles.btneditNdelNreplytxt}>답글</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btneditNdelNreply}>
                                    <Text style={styles.btneditNdelNreplytxt}>수정</Text>
                                </TouchableOpacity> */}

                {/* <TouchableOpacity style={styles.btneditNdelNreply}
                                    onPress={() => delReply(item.Idx)}>
                                    <Text style={styles.btneditNdelNreplytxt}>삭제</Text>
                                </TouchableOpacity> */}
                <BtnDelReplyQnA
                  navigation={navigation}
                  email1={item.email}
                  email2={logininfo.email}
                  idx={item.Idx}
                />
              </View>
            </View>
          )}
          // refreshing={isrefresh}
          // onRefresh={_handleRefresh}
          windowSize={6}></FlatList>
        {/* <View style={styles.bottommargin}></View> */}
      </ScrollView>
      <View style={styles.replycontainer}>
        <TextInput
          style={styles.replybox}
          placeholder={'댓글을 입력해 주세요.'}
          placeholderTextColor={'#ccc'}
          multiline
          value={reply}
          onChangeText={(text) => setreply(text)}
        />
        <Replydatachk />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  scrollview: {
    marginBottom: 60,
  },
  body: {},
  // image:{
  //     width:250,
  //     height:180,
  //     borderRadius:20,
  //     margin:5,
  // },
  // imgcnt:{
  //     color:'black'
  // },
  textContainer: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  textContainer2: {
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flexDirection: 'row',
    position: 'absolute',
    top: 8,
    paddingHorizontal: 13,
  },
  titledesc: {
    color: 'black',
    marginVertical: 25,
    marginHorizontal: 13,
    fontSize: 20,
    fontWeight: 'bold',
  },
  desc: {
    color: 'black',
    marginVertical: 35,
    marginHorizontal: 13,
    fontSize: 16,
  },
  cnt: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingRight: 10,
    bottom: 0,
  },
  cnt2: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    right: 0,
    marginRight: 5,
  },
  // cnt2:{
  //     // position:'absolute',
  //     flexDirection:'row',
  //     // alignSelf:'flex-end',
  //     // justifyContent:'flex-end',
  //     // paddingRight:10.5,
  //     // bottom:50,
  //     // backgroundColor:'white',
  //     // width:'100%',
  //     height:30,
  //     // borderTopWidth:1,
  //     // borderColor:'#eee',
  viewcnt: {
    marginLeft: 7,
    marginBottom: 7,
  },
  replyimg: {
    width: 18,
    resizeMode: 'contain',
    marginRight: 4,
    marginTop: 1,
  },
  cntReplyLike: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replycnt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
  },
  replycnttext: {
    color: 'black',
    alignSelf: 'center',
  },
  // imgscroll:{
  //     borderTopWidth:1,
  //     borderColor:'#eee',
  // },
  // imgwrap:{
  //     alignItems:'center',
  // },
  replycontainer: {
    height: 50,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
  replybox: {
    flex: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  btnreplyinactive: {
    flex: 1.2,
    height: 35,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: '#afafCE',
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  btnreply: {
    flex: 1.2,
    height: 35,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: '#560CCE',
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  btnreplytext: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  replyslist: {
    marginBottom: 50,
  },
  replyscontainer: {
    width: '100%',
    // height:80,
    // justifyContent:'center',
    // alignContent:'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateNbtns: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  replysname: {
    flex: 1,
  },
  replysnametxt: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  replysdate: {},
  replysdatetxt: {
    fontSize: 13,
    color: '#999',
  },
  replysdesc: {
    marginTop: 4,
  },
  replysdesctxt: {
    fontSize: 13,
  },
  btneditNdelNreply: {},
  btneditNdelNreplytxt: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
