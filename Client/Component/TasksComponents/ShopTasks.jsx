import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextInput, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { List } from 'react-native-paper';
import { Feather, Ionicons } from '@expo/vector-icons';

import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'

import { useUserContext } from '../../UserContext'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ShopTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [tasks, setTasks] = useState([])
  const [newProductName, setNewProductName] = useState('')


  const [shopTasks, setShopTasks] = useState(props.allShopTasks)
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);

  const getShopTasks = () => {
    return props.allShopTasks
  }

  const [isCheck, setIsCheck] = useState(false)
  const checkIcon = [
    "check-circle",
    "circle"
  ]
  useEffect(() => {
    setShopTasks(props.allShopTasks)
  }, [props.allShopTasks])


  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleAddingSubTask = (taskToAddProduct) => {
    if (newProductName === '') {
      Alert.alert('Please enter a product name')
      return
    }
    console.log(newProductName)
    let newProductUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertProductsToList'
    let newProductData = {
      listId: taskToAddProduct.listId,
      productQuantity: 0,// will change to the value from the input field
      productName: newProductName,
    }
    fetch(newProductUrl, {
      method: 'POST',
      body: JSON.stringify(newProductData),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        console.log('res=', res);
        //if res status is ok or 200
        if (res.ok) {
          setNewProductName('')
          props.refreshlPublicTask()
          console.log('product added')
        }
        return res.json()
      }
      )
      .then(
        (result) => {
          console.log("fetch btnFetchGetAllTasks= ", result);
        }
      )
      .catch(
        (error) => {
          console.log("err post=", error);
        }
      )
  }

  const updateCompleted = () => {
    console.log('Updating completed')
  }

  // const temp =  () =>{
  //  { <Text style={styles.taskName}>Super Market</Text>
  //   <View style={styles.tasksContainer}>
  //       {/* <TouchableOpacity style={styles.left} onPress={updateCompleted}>
  //         <Feather name="circle" size={30} color="#548DFF" />
  //       </TouchableOpacity> */} 
  //style={styles.right}>
  //         <View style={styles.rightInside}>
  //           <TouchableOpacity style={styles.qtyTxt} onPress={handleAddingSubTask}>
  //             {/* <Text style={styles.subtaskTxt}>Qty</Text> */}
  //             {/* <Feather name="plus" size={30} color="#548DFF" /> */}
  //           </TouchableOpacity>
  //           <TouchableOpacity style={styles.iconUp} onPress={handleAddingSubTask}>
  //             <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
  //           </TouchableOpacity>
  //           <TouchableOpacity style={styles.iconDown} onPress={handleAddingSubTask}>
  //             <Ionicons name="md-caret-down-outline" size={17} color="#808080" />

  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </View>
  //   </View>}
  // }

  const isProductChecked = (prod, actualTask) => {
    // update the product status to 'F' for now its only on the client side
    setShopTasks(shopTasks.map((task) => {
      if (task.listId === prod.listId && task.actualId === actualTask.actualId) {
        task.prodtList.map((product) => {
          if (product.productId === prod.productId) {
            if (product.productStatus == 'P') {
              product.productStatus = 'F'
            } else {
              product.productStatus = 'P'
            }
          }
        })
      }
      return task
    }))
  }
const handleQtyChange = (qty,prod,actualTask) => {
  // add the qty to the product
  setShopTasks(shopTasks.map((task) => {
    if (task.listId === prod.listId && task.actualId === actualTask.actualId) {
      task.prodtList.map((product) => {
        if (product.productId === prod.productId) {
          product.productQuantity = qty
        }
      })
    }
    return task
  }))
}
const handleQtyPlus = (prod,actualTask) => {
  // add the qty to the product
  setShopTasks(shopTasks.map((task) => {
    if (task.listId === prod.listId && task.actualId === actualTask.actualId) {
      task.prodtList.map((product) => {
        if (product.productId === prod.productId) {
          product.productQuantity = product.productQuantity + 1
        }
      })
    }
    return task
  }))
}
const handleQtyMinus = (prod,actualTask) => {
  // add the qty to the product
  setShopTasks(shopTasks.map((task) => {
    if (task.listId === prod.listId && task.actualId === actualTask.actualId) {
      task.prodtList.map((product) => {
        if (product.productId === prod.productId) {
          if (product.productQuantity > 0) {
            product.productQuantity = product.productQuantity - 1
          }
        }
      })
    }
    return task
  }))
}
  return (
    <View style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.92 }}>
        <List.Section>
          <ScrollView>
            {shopTasks.map((task, index) => {
              return (
                <List.Accordion key={index} style={{ backgroundColor: '#F2F2F2' }}
                  left={() => <Text style={styles.taskName}>{task.taskName}</Text>}
                  right={() => { return <Feather name="chevron-down" size={26} color="#548DFF" /> }}
                >
                  <List.Item key={null} style={styles.productItem}
                    left={() => {
                      return (
                        <TextInput value={newProductName} style={styles.subtaskTxt} placeholder="Click here to add a product..." onChangeText={setNewProductName} />
                      )
                    }
                    }
                    right={() => {
                      return (<TouchableOpacity onPress={() => handleAddingSubTask(task)}>
                        <Feather style={styles.iconPlus} name="plus" size={25} color="#548DFF" />
                      </TouchableOpacity>
                      )
                    }}
                  />
                  {
                    // if there are prodtList items in the task then show them,else there is no subtask
                    task.prodtList != null ?
                      task.prodtList.map((prod, index) => {
                        return (
                          <List.Item
                            key={prod.productId} style={styles.productItem}
                            title={prod.productName}
                            titleStyle={{
                              fontSize: 18,
                              fontFamily: 'Urbanist-SemiBold',
                              color: '#000',
                              textDecorationLine: prod.productStatus == 'F' ? 'line-through' : 'none'
                            }}
                            left={() =>
                              <TouchableOpacity onPress={() => isProductChecked(prod, task)}>
                                <Feather name={prod.productStatus == 'P' ? checkIcon[1] : checkIcon[0]} size={27} color="#548DFF" />
                              </TouchableOpacity>}
                            right={() =>
                              <View>
                                <TouchableOpacity style={styles.iconUp} onPress={()=>handleQtyPlus(prod,task)}>
                                  <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconDown} onPress={()=>handleQtyMinus(prod,task)}>
                                  <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                </TouchableOpacity>
                                <TextInput returnKeyType='done' keyboardType='numeric' value={prod.productQuantity=!0?`${prod.productQuantity}`:''} style={styles.qtyTxt} placeholder='Qty' onChangeText={(text) => handleQtyChange(text, prod, task)} />
                              </View>
                            }
                          />
                        )
                      }
                      ) : null
                  }
                </List.Accordion>
              )
            })
            }
          </ScrollView>
        </List.Section>
      </View>
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  iconPlus: {
    position: 'absolute',
    right: -5,
  },
  iconUp: {
    position: 'absolute',
    right:-20,
    bottom: 9,
    width: 20,
  },
  iconDown: {
    position: 'absolute',
    right: -20,
    bottom: -9,
    width: 20,
  },
  qtyTxt: {
    fontSize: 16,
    paddingTop: 5,
    paddingRight: 10,
    fontFamily: 'Urbanist-Regular',
    color: '#808080',
  },
  subtaskTxt: {
    fontSize: 18,
    paddingLeft: 10,
    fontFamily: 'Urbanist-Regular',
    width: SCREEN_WIDTH * 0.72,
    color: '#808080',
  },
  taskName: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginVertical: 10,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  productItem: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.88,
    height: 54,
    backgroundColor: '#EBF1FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

});