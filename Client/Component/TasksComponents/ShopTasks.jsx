import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, TextInput, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { useFocusEffect, useRoute,useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import { useUserContext } from '../../UserContext'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;




function RenderShopTasks(props) {
  const [newProductName, setNewProductName] = useState('');
  const handleAddingSubTask = (taskToAddProduct) => {
    if (newProductName === '') {
      Alert.alert('Please enter a product name')
      return
    }
    let newProductUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertProductsToList'
    let newProductData = {
      productQuantity: 0,// will change to the value from the input field
      productName: newProductName,
      actualId: taskToAddProduct.actualId,
      taskId: taskToAddProduct.taskId,
      commentForProduct: '',
    }
    // fix this amitai
    fetch(newProductUrl, {
      method: 'POST',
      body: JSON.stringify(newProductData),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        // console.log('res=', res);
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

  return (
    <List.Item
      key={props.index} style={styles.productItem}
      left={() => <TextInput value={newProductName} style={styles.subtaskTxt} placeholder="Click here to add a product..." onChangeText={setNewProductName} />}
      right={() =>
        <TouchableOpacity onPress={() => handleAddingSubTask(props.task)}>
          <Feather style={styles.iconPlus} name="plus" size={25} color="#548DFF" />
        </TouchableOpacity>
      }
    />
  )
}

export default function ShopTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [tasks, setTasks] = useState([])
  const [shopTasks, setShopTasks] = useState(props.allShopTasks)
  const [productsForUpdateInDB, setProductsForUpdateInDB] = useState([])
  const checkIcon = ["check-circle", "circle"]

  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    setShopTasks(props.allShopTasks)
  }, [props.allShopTasks])

  useFocusEffect( //we need to update the products in the db when we leave the screen
    useCallback(() => {
      return () => {
        updateProductsInDB()
      };
    }, [])
  );
  
  useEffect(() => {
    if (isFocused && route.params) {
      const { task } = route.params;
      //find the task in the array of tasks
      let taskToUpdate = shopTasks.find(t => t.taskId == task.taskId && t.actualId == task.actualId)
      //open the List.Accordion on this task
      console.log('task', taskToUpdate)  
    }
  }, [isFocused, route.params]);   
  const handleAddBtnPress = () => {
    // console.log(shopTasks)
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    props.refreshPublicTask()
    props.refreshPrivateTask()
  };

  const isProductChecked = (prod, actualTask) => {
    // update the product status to 'F' for now its only on the client side
    setShopTasks(shopTasks.map((task) => {
      if (task.taskId === prod.taskId && task.actualId === actualTask.actualId) {
        task.prodList.map((product) => {
          if (product.productId === prod.productId) {
            if (product.productStatus == 'P') {
              product.productStatus = 'F'
            } else {
              product.productStatus = 'P'
            }
          }
        })
      }
      //check if this product is in the array of products that need to be updated in the DB
      if (productsForUpdateInDB.find(p => p.productId == prod.productId) == null) {
        productsForUpdateInDB.push(prod)
      }
      else {
        productsForUpdateInDB.map(p => {
          if (p.productId == prod.productId) {
            p.productStatus = prod.productStatus
          }
        })
      }

      return task
    }))
  }

  const handleQtyArrows = (isPlus, prod, actualTask, qty) => {
    setShopTasks(shopTasks.map((task) => {
      if (task.taskId === prod.taskId && task.actualId === actualTask.actualId) {
        task.prodList.map((product) => {
          if (product.productId === prod.productId) {
            if (isPlus && qty == 0) {
              product.productQuantity = parseInt(product.productQuantity) + 1
            }
            else if (isPlus == false && product.productQuantity > 0 && qty == 0) {
              product.productQuantity = parseInt(product.productQuantity) - 1
            }
            else if (isPlus == null && qty >= 0) {
              if (isNaN(qty) || qty == '' || qty == null) {
                product.productQuantity = 0
              }
              else
                product.productQuantity = qty
            }
          }
        })
      }
      //check if this product is in the array of products that need to be updated in the DB
      if (productsForUpdateInDB.find(p => p.productId == prod.productId) == null) {
        productsForUpdateInDB.push(prod)
      }
      else {
        productsForUpdateInDB.map(p => {
          if (p.productId == prod.productId) {
            p.productQuantity = prod.productQuantity
          }
        })
      }
      return task
    }))
  }

  const updateProductsInDB = () => {
    let updateProductsUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateProductsToList'
    fetch(updateProductsUrl, {
      method: 'PUT',
      body: JSON.stringify(productsForUpdateInDB),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.92 }}>
        <List.Section>
          <ScrollView>
            {shopTasks.map((task, index) => {
              return (
                <List.Accordion
                  key={task.actualId}
                  style={{ backgroundColor: '#F2F2F2' }}
                  left={() => <Text style={styles.taskName}>{task.taskName}</Text>}
                >
                  <RenderShopTasks task={task} index={index} refreshlPublicTask={props.refreshPublicTask} />
                  {task.prodList != null ? // if there are prodtList items in the task then show them,else there is no subtask
                    task.prodList.map((prod) => {
                      return (
                        <List.Item
                          key={prod.productId}
                          style={styles.productItem}
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
                            </TouchableOpacity>
                          }
                          right={() =>
                            <View style={[{ display: prod.productStatus == 'F' ? 'none' : 'flex' }, { paddingRight: 10 }]}>
                              <TouchableOpacity style={styles.iconUp} onPress={() => handleQtyArrows(true, prod, task, 0)}>
                                <Ionicons name="caret-up-outline" size={20} color="#808080" />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.iconDown} onPress={() => handleQtyArrows(false, prod, task, 0)}>
                                <Ionicons name="caret-down-outline" size={20} color="#808080" />
                              </TouchableOpacity>
                              <TextInput style={styles.qtyTxt} returnKeyType='done' keyboardType='number-pad' value={prod.productQuantity != 0 ? `${prod.productQuantity}` : ''} placeholder='Qty' onChangeText={(text) => handleQtyArrows(null, prod, task, text)} />
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
    </SafeAreaView>
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
    right: -15,
  },
  iconUp: {
    position: 'absolute',
    right: -22,
    bottom: 11,
    width: 25,
  },
  iconDown: {
    position: 'absolute',
    right: -22,
    bottom: -7,
    width: 25,
  },
  qtyTxt: {
    fontSize: 16,
    paddingTop: 3,
    textAlign: 'right',
    width: 45,
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
    right: 10,
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