import React, {useState, useEffect} from 'react'
import {View, Text, ScrollView, StyleSheet, Alert, FlatList} from 'react-native'
import MSSQL from 'react-native-mssql'
import Loading from '../components/Loading';
import Card from '../components/Card';

const config = {
  server: '211.219.52.31', //ip address of the mssql database
  username: 'cube2020', //username to login to the database
  password: 'cube2020', //password to login to the database
  database: 'cube2020', //the name of the database to connect to
  port: 1433, //OPTIONAL, port of the database on the server
  timeout: 5, //OPTIONAL, login timeout for the server
}



export default function Dashboard({navigation}){

  const [data, setdata] = useState([])
  const [ready,setReady] = useState(true)
  let alldata = data

  const calldata = async() => {
    // console.log("==================== calldata() ====================");
    const connected = await MSSQL.connect(config);
    const query = `select category, date, [desc], idx, image, title from bbs`
    // where email='${String(email.value)}' and passwd='${String(password.value)}'
    const resdata = await MSSQL.executeQuery(query);
    const closed = await MSSQL.close();
    setdata(resdata)
  }


  useEffect(()=>{
    navigation.setOptions({
      title:'게시판'
    })
    // calldata()
      
    calldata()
    // setdata(resdata)
    setReady(false)
  })

  return ready ? <Loading/> : (
    <ScrollView style={styles.container}>
      <View>
        <Text>test</Text>
      </View>
      
      <View style={styles.cardContainer}>
        {
          console.log()
          // data.map((content,i)=>{
          //   return (<Card content={content} key={i} /*navigation={navigation}*//>)
          // })
        }
      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    //앱의 배경 색
    backgroundColor: '#fff',
  },
  cardContainer: {
    marginTop:10,
    marginLeft:10
  },
})