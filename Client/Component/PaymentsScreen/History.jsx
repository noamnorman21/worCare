
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;



export default function History({ navigation, route }) {
  const { userContext } = useUserContext();// יש להחליף למשתנה של המשתמש הנוכחי
  const [History, setHistory] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);

  const Edit = (id, data) => {
    Alert.alert(
      "Edit",
      "Are you sure you want to Edit this request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => navigation.navigate('EditPaymentScreen', { id: id, data: data }) }
      ],
      { cancelable: false }
    );
  }



  useEffect(() => {
    if (isFocused) {
      getHistory()
    }
  }, [isFocused])

  const getHistory = async () => {
    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userContext.Id)
      });
      // const data = await response.json();
      const data =
        [
          {
            "requestId": 121,
            "requestSubject": "Webb",
            "amountToPay": 384.40220094490894,
            "requestDate": "2022-04-27T00:00:00",
            "requestProofDocument": "3YYZBG0PT165MQV0224GU10BIWDTYNX63XFTQRL6S13NH6PO6ZFXSN32YMGE26R53Z2OA19BHXNTYDTB7PNZ80EGTDV3A63LAXJI40D4P4GVZA4KT57DJRX3LMVX560AT1J0TB76BI93KIGJ8AA5ZQ2I0",
            "requestComment": "Sed vantis. rarendum et quo egreddior quo quartu essit. et quo e novum egreddior et fecit. non quo nomen",
            "requestStatus": "R",
            "userId": 1,
            "fId": 0
          },
          {
            "requestId": 181,
            "requestSubject": "Cutomer",
            "amountToPay": 86.207947105266129,
            "requestDate": "2022-06-12T00:00:00",
            "requestProofDocument": "YCBXHRWXKR7HIS7VJZJ41VGC8JBGZRGWRAO39QAY2XG12H0QR4IXFRE2WZPYFFXSBAQ744LSPL14EF9RJKOU9IHZWL691BINZNPRRTMMJP7UPANHQXEUQ2ISTQAIYBQD2E4QPI0PY1BJBN9MXPJ4XOWW5XY1I3O7ZTRB5WR7XOWORYH6GOK8RMGEH7LSJZ7VC3KIVYG1XB68S756FSKUIGGCCDUYBZOYH0CNEZAI8JBFF8M91FCREDCWN75I3IQXN8QRVHSGH2LZ40X4RKWVNWK4OF06TSEQTDS7HUEJMV9BRDRNA0RJLUAROM2GHMMPOV5R8QMW6C9RM8CANDVT1U4Z20IUSX208JNW70FKDUC9KJ4FARS4QTOTQ6O77S48A8I3KG3NYBF6HVEJW2K05YAFUT50B7DLQ4ZB10VTO55EEIBVS5A4843BY38QB2BQYTFDW2IV7QBZSV0CI986X8DM0NCYS4IMUFGK2XZPNEWHS4J32V81T5TPGTD9PJ238P5CFG9KAIIICVTW39WWVGSOMQ38JQ03BT93Y6OLLNRBMADK0H5GN67RXGQOC10KIF6JMQXXKAA8OG1BCJ82LKF5LH5HGZ8KN7T74UYAK7VDVZ3GEFBTSYZXZ0X5KFHL1QLHNU6ILYIDP2AMEP30NFSO8V83WSP4Q9B5ELSK8T8UGM8WQAQUCGXMYW9SL3LS8DMFQ58SWISU7X8LMBDM1VSACP7HB0Y57FL2ZT5K2YXTN3E0NN5APZQDKB21YQGWKNMRC5MS6SJ3XZM9A7TOUOF8P7IOR4MBH190GNNI1D3XFMGLOTQRWS2V8E24NY1157MWPMSNJBMHKHS2RWZXDVFPYER2KJU3B1R80JW2027K5LAQMZCRY4O9SXXBVQ20HJ5IQK180WXAOUJD31FK6347DHF3MK79063MFS02Y4Q26DLXDK8TAHUDEY584XLFPNAHQXXB1DM1C20ZWIQ1CDYICQ7HMRX0IBCJ347GMWSWVS0CX5CL7J2COS40PGO9GLI1QGWSB9FFK1MKPVJHFBSY8ZUBZ6R68IG99ZLH9KAY4MRM5KBTW6U4SJSQLLS4I971LCAP928V1UUL885EUX91OCHQ7VVOR6FVFP1SAMJUYZ2XP6IDFEAKZ5D8VKIE7J4VEZ6I6C48DF2P9J00DH8CWUV9CTXQ35NEV7JP0063A17K2OYCJH1PBRZK3W5DFD48RNT20AZDB52UNA7NVK7M4X348ZM4UTOWWZSFUWC8IOE6O4WTPHIU6I4UKPT1OUJHH6XOHSTY8Y3FJWF42SFCBTPEVYU43BJN5WPH68BXOJM7EOAN9OYVF76NGJTJXOVWFGAM7YXUHINR7HZ7N6UECN8YQ20NFSZZNPSYDOGBR4EWJEGZJLVRUHJS7CV5X9FPJN4HP0TZPIM89BECL14TW85560R0SBEHPODVAZ9IRV1BUAJWXJJV5LSAIYBP9T6D44JKXJ1MRL106UAVHU28SIC3V3CBOK9YPN7QRYYEHX3JKS3ONF8FQYLLSGOU6QX7C2BIMK3IVNQUFSJ3ZON8CU8R2MXBA48RZW7HGK12CPJ27Q5ZXKVH2PVHUKG0NS8RFZVIK1NEMLWMA5KBGXEP9QO91QNV41FJHSN7VNFVXGUHT86P04KPEIHOALHUER9L5C4IICGTIISSW7GSJYVZGQ4ZAYWA5KH568BG4O6NOR6WQPS35PBFV94F858JF6NX1MLNWZNVR7BPJ88K6T5G919W4V8YFN7I38V445651GOOYFWZWNCM17OZCOJ0QPF3ZTMAD4G1MZETDLYOZ91SALGVKVRFM6FC0KO4SLMS7BZ1SUMQQU0HNNSDCQQHC1FGK2SSXTWEN9LZMF3P91PR5YODRAS1U4G5WIHP2UTWXMTE2TRXN08BBNBLDE0M1UJJTF24XDNF7TUJ4ABXJUETW4T97WBNT6U32AKMRM0ADS3ISSH33227GQNOLSX11ZL0YQGTPO6XU3G31BGFE8KQ3NMCNW1YPZ9D62J2BNDEW5DC9JNACIMSFVXB336TN77UU2WYRE3RU6UY9A239RM7CGXB58Y7HKQOYIH7NOIXEVX90Y1T12KWK0HE4KTJGVAAF50RTVFK8PSHIOB6646E0T4X0223VZHJKNUUYA05MZOV80WG8MCBOVAL12QQSCP888WUUG7V40R058P06MU8M5UPD8TWK9DAAGNZ31M",
            "requestComment": "gravis trepicandor Pro vobis essit. parte bono linguens si quad manifestum Tam fecundio, non eggredior.",
            "requestStatus": "F",
            "userId": 1,
            "fId": 0
          },
          {
            "requestId": 186,
            "requestSubject": "Marketing",
            "amountToPay": 436.25614079006772,
            "requestDate": "2022-04-06T00:00:00",
            "requestProofDocument": "DJB8A28FYJ3V3INQJZC63333SGI742XD1H4N0B8JFV0AP0469EMJRLG9F7FUK0AVMPTMDZP7QSQ72SESBCYPFELF0V7TWEZEK4OZ6IS9OFSYV96MSNI72LF74ELIRWBCSBNY4FLSJO00MMKROK08VRCZPGUSX9IS4F5JM8ID1POEKFLHTTU6W2H1ZN9OKSV968V6G05G2M653XE9UDY3FBW2Y4JYZTT9UE8CJF0SOE39VCX28ZT6TRTUCT7CH6G8TXAOP2PED6E18M6M7HP00MF2KDZP7OBHXUFY18C69ETNDRMPNL4ZHG87H83B207OUW4D78KY4JQLSSPSRA2LJB0HM8GT413974SGN9IF06UXPNEPIBJSXL5JWNQZSRT3GHDNZ95ISNLCG3RZTQATHABMZ9J0IIN9CRH89QQ851ZA0S2TVR61GZL55ROPP4Z9ZB0PLJQ2Z1NGB0L77Q5RCLSD5C2H21J11QAOSC7C032FB5T46HIYZ8XEJMK8G9ZYIMFLQXEUITQ8ID1ZIXBKIK2SSW45SZVR34WPQ8E82NG6HOV6LKPJYFFYKMSUS92JXZ5EGB99I2IV4VB40YJ79CTOOY54GKGTLW8IJHQ9BF0VWJTOANUUPUAL5GQH65TYLPA8NSLI8AWTCXR44GTTQM3QMND2R825M1A79L0I1BMFXG97OLCQBZ8ZLJLZFIRZ7R6ANKVJFARFZOT5E5E5VCTMTAMPZ12JJM769YK4QTA08SZWQGLA4M4UXJGDX5JE88VDGNVFKAF12SE0APZJFSEXIC8PH76KAVSZWMG3K5PU62S45F2850ZFTYV3E5YD3UR70E4N9WY92KQFK4K24XEAWD6YRCPE7CQBBL4QBEZ91PD97FJ9LW86FHBM86WW7J2QUE4Z0TQPY586ZWQCTFTB3KWU9HH5I32HMNFTBJ9R5J7A84NCFJ2RQQMAI9PJBK6V2QJCHX0A616KCLL5U5PZ0ARW04A1TPGKCC7HKAUIJSLOK1XWNKO5V7USZNBCMZGGLL8ZE4KJB6F8P3BZ6DD90AP4HFIWYHWKB42ZSYIJZ5UORM2VCC58L7FBW3IZMOLTAVWK0C68VU9VG0CUCMKMCNZ3PR3PFJWBK0EWQIU06WDQXJVVRNMZ3ZHMWSV98HSBXYBFMG4URKGF9855W7XSWX7LJR0XMLRO42TZ8G9BIS8JI2DNMQD0J0F0QQVVF676SRB7F6XFYM93PO2HDCAW8Q43NS9HKDVCL2QRR68GTX2XQBB1OEH3VBX2M7KMWFVKRXINXAQ73U3AO7CBH7T5WRGA4O4JLLJD1H6TTO4DO9018MDEU85PMQOZG7I956LHAP971JHT3FGNRE2HAPODGURAT6CL5U8INIQID6DBQBM7A08251YFH81GYYEU6WN87X09OJ44CDM48J0SYAF4WS0EHAKESI4UOD0C0YDMWT34MW8EYLWWGJCEWLRDZPCT9SGUJNSZWT72PWSK25G6M8D41LFF7ZM7G9UUFDUATWZNC9P0S6BU8671EBSY7DSW6ZMG1Y4OA5DQ8PSSWFM0OSYA2TF4KW2G33GCN9YU2NJ3SGSOJ01SQS8E1BD8J03D3XM58G5NHSY08VHL0QKKVAPBU2BBVQB1K60VUNF2UEAYT855TS7SFIIS8AA55TSRHWG2VMQDAHPHZQIMX5I2IIL1N7NKD9X1MJHWR2962UHXT1SHSO8ZBP8YBEENZ6Z0KOVF9LUVVB0O0O8ME5RP1YPWBILDNL7W",
            "requestComment": "egreddior quantare vobis Multum Pro manifestum non homo, volcans fecit. quo manifestum brevens, novum delerium. venit.",
            "requestStatus": "F",
            "userId": 1,
            "fId": 0
          },
          {
            "requestId": 226,
            "requestSubject": "Cutomer",
            "amountToPay": 720.026788474073,
            "requestDate": "2022-09-08T00:00:00",
            "requestProofDocument": "RPI3O19E7P01LN3AEMNYNNQ8R6GSKPBM0EPZCYZACPHBD9T58LZ2M494Z9BIKHUIDD06Y4YFMDLY5FVHDBKZP90V5L02NHPVVZX08M74MJF9IBZKET49WUT4D40C4VS5NQ25HU9Q3GC5TQDULFNTCGY15SN4MU0RQ9MS8T2KKE5GHNBMR5QO8ZT7S10O7449FLEJ4KMSD38XAIJIH0CG3CJRFF07TECFAW0W8RH6JYB4QWWAIH66SO532N3PKEZYQSNEHM9QI5W50E0JIPPB76NMRXULNSM4YCDX9HSV7GNMRZ2NMK6UPNRK51NKSO2QJR7O03A1XT3QI0URU6",
            "requestComment": "Et eggredior. quo, fecit. e plurissimum homo, quantare in in egreddior venit. gravis gravis e Versus",
            "requestStatus": "C",
            "userId": 1,
            "fId": 0
          },
          {
            "requestId": 504,
            "requestSubject": "Shelbi",
            "amountToPay": 10.0,
            "requestDate": "2023-03-17T00:00:00",
            "requestProofDocument": "https://firebasestorage.googleapis.com/v0/b/worcare-3df72.appspot.com/o/images%2F08398a46-36b6-4d66-b3d8-c9b380d55a9b.jpeg?alt=media&token=169c7cad-e86a-4db4-abdd-59284c40a0b2",
            "requestComment": "Sh",
            "requestStatus": "R",
            "userId": 1,
            "fId": 0
          }
        ]

      let arr = data.map((item) => {
        return (
          <Request key={item.requestId} getHistory={getHistory} data={item} id={item.requestId} Notofication={Notification} View={View} Edit={Edit} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setHistory(arr)
    } catch (error) {
      console.log(error)
    }
  }

  const [list, setlist] = React.useState();



  const Notification = (id) => {
    Alert.alert(
      "Notification",
      "Are you sure you want to send a notification to the user?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.pending}>
      {History}
      {userContext.userType == "Caregiver" ? <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View> : null}
      <Modal animationType='slide' transparent={true} visible={modal1Visible}>
        <NewPayment cancel={() => setModal1Visible(false)} />
      </Modal>

    </ScrollView>
  );
}

function Request(props) {
  const [expanded, setExpanded] = React.useState(true);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const status = props.data.requestStatus;
  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };

  const displayStatus = () => {
    if (status == "F") {
      return "Finished"
    }
    else if (status == "C") {
      return "Canceled"
    }
    else if (status == "R") {
      return "Rejected"
    }
    else if (status == "P") {
      return "Pending"
    }
  }

  const Download = async () => {
    const url = props.data.requestProofDocument;
    const dot = url.lastIndexOf(".");
    const questionMark = url.lastIndexOf("?");
    const type = url.substring(dot, questionMark);
    console.log("Type", type)
    
    const filename = props.data.requestId+type;
    console.log(filename)
    const downloadDest = `${FileSystem.documentDirectory}${filename}`;
    console.log("Download Dest", downloadDest)
    const { uri } = FileSystem.getInfoAsync(downloadDest);
    console.log("New Urlli",uri)
    if (!uri) {
      console.log('Downloading to ', downloadDest);
      FileSystem.makeDirectoryAsync(downloadDest, { intermediates: true });
      let uri = FileSystem.getInfoAsync(downloadDest)
      console.log("New Uri",uri)
    }  

    const res = await FileSystem.downloadAsync(url,downloadDest)
    console.log("res", res)

    saveFile(res);
  }


  const saveFile = async (res) => {
    console.log("Uri1", res)
    const asset = await MediaLibrary.createAssetAsync(res.uri);
    console.log("Asset1", asset)
    await MediaLibrary.createAlbumAsync('Downloads', asset, false);
    Alert.alert("Downloaded Successfully")
  }




  return (
    <List.Accordion style={!expanded ? (status == "F" ? [styles.requestFocused, styles.finishedRequestFocused] : [styles.requestFocused, styles.notCompleteRequestFocused]) : styles.requestunFocused}
      theme={{ colors: { background: 'white' } }}
      right={() => <View style={styles.requesRight}><Text style={styles.requestHeaderText}>{props.subject}</Text>

      </View>}
      left={() => <View >
        <Text style={styles.requestHeaderText}>{props.date.substring(0, 10)}</Text>
      </View>}
      expanded={!expanded}
      onPress={toggle}
    >
      <View style={!expanded ? status == "F" ? ([styles.Focused, styles.completeFocused]) : ([styles.Focused, styles.notCompleteFocused]) : null}>
        <View>
          <List.Item title={() => <Text style={styles.itemsText}>Date: {props.date.substring(0, 10)} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Amount: {props.amountToPay} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Comment: {props.requestComment} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Status: {displayStatus()} </Text>} />
          <List.Item title={() =>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () => { setModal2Visible(true) } : null}>
                <Text style={styles.viewbuttonText}>View Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () => { setModal1Visible(true) } : null}>
                <Text style={styles.editbuttonText}>Edit</Text>
              </TouchableOpacity>
              <Modal animationType='slide' transparent={true} visible={modal1Visible}>
                <EditPaymentScreen cancel={() => { setModal1Visible(false); props.getHistory() }} data={props.data} />
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <View style={styles.documentview}>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <Text>{props.data.requestProofDocument}</Text>
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={Download} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.documentCancelButton} onPress={() => setModal2Visible(false)}>
                    <Text style={styles.documentCancelText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

            </View>} />
        </View>
      </View>
    </List.Accordion>
  )
}



const styles = StyleSheet.create({

  pending: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10
  },
  requestunFocused: {
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.073,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF2',
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    paddingLeft: 12,

  },
  requestFocused: {
    justifyContent: 'center',
    paddingLeft: 12,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.073,
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderTopLeftRadius: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomMargin: 10,

  },
  finishedRequestFocused: {
    borderTopColor: '#7DA9FF',
    borderLeftColor: '#7DA9FF',
    borderRightColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    shadowColor: '#000',
  },
  notCompleteRequestFocused: {
    borderTopColor: '#E6EBF2',
    borderLeftColor: '#E6EBF2',
    borderRightColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
  },
  requestHeaderText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  requestHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'none',
    height: SCREEN_HEIGHT * 0.08,
    width: SCREEN_WIDTH * 0.85,
    flexDirection: 'row',
    padding: 16,
  },
  requestHeaderIcon: {
    zIndex: 0,
    position: 'absolute',
    right: SCREEN_WIDTH * 0,
    backgroundColor: 'orange',
  },
  Focused: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  completeFocused: {
    borderLeftColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    borderRightColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
  },
  notCompleteFocused: {
    borderLeftColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
    borderRightColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
    borderBottomEndRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SCREEN_WIDTH * -0.16, //NEED TO CHANGE
    marginRight: SCREEN_WIDTH * 0.02,
    fontFamily: 'Urbanist-Regular',
  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height: 40,
    width: SCREEN_WIDTH * 0.36,
    borderRadius: 16,

  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 40,
    width: SCREEN_WIDTH * 0.36,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA9FF',
    marginLeft: 10,
  },

  viewbuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editbuttonText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addRequestText: {
    color: 'white',
    fontSize: 26,
    marginBottom: 2,
    fontFamily: 'Urbanist-SemiBold',
  },
  documentview: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    flex: 1,

  },
  documentImg: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 16,
  },
  documentDownloadButton: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#7DA9FF',
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    marginBottom: 10,
  },
  documentCancelButton: {
    fontSize: 16,
    borderRadius: 16,
    borderColor: '#7DA9FF',
    borderWidth: 1,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1.5,
    backgroundColor: '#F5F8FF',
    borderColor: '#548DFF',
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },
  documentCancelText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },

})
