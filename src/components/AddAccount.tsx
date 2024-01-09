import { Modal, StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import icon_close_modal from '../assets/icon_close_modal.png'
import { getUUID } from '../utils/UUID'
import { load, save } from '../utils/Storage'
import { account } from '../views/Home'

export interface Ref {
  show: (ID?: string) => void,
  close: () => void,
}

export interface Props {
  onSave?: () => void
}

export default forwardRef(({ onSave }: Props, ref) => {

  const [ID, setID] = useState('')
  const [visible, setVisible] = useState(false)
  const [isModify, setIsModify] = useState(false)
  const [type, setType] = useState('游戏')
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  const handleSavePress = async () => {
    const newAccount = {
      ID,
      type,
      name,
      account,
      password
    }

    const accountsStr = await load('accounts')
    let accounts: account[] = accountsStr ? JSON.parse(accountsStr) : []
    if (isModify) {
      accounts = accounts.map(item => {
        return item.ID === ID ? newAccount : item
      })
    } else {
      accounts.push(newAccount)
    }
    await save('accounts', JSON.stringify(accounts))
    onSave && onSave()
    close()
  }

  const show = async (ID: string = '') => {
    if (ID) {
      const accountsStr = await load('accounts')
      const accounts: account[] = accountsStr ? JSON.parse(accountsStr) : []
      const currentAccount = accounts.find(item => item.ID === ID)
      setID(currentAccount!.ID)
      setType(currentAccount!.type)
      setName(currentAccount!.name)
      setAccount(currentAccount!.account)
      setPassword(currentAccount!.password)
      setIsModify(true)
    } else {
      setID(getUUID())
    }
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
  }

  useImperativeHandle(ref, () => {
    return {
      show,
      close
    }
  })

  const renderType = () => {
    const types = ['游戏', '平台', '银行卡', '其它']
    const computeStyle = (item: string, index: number) => [
      styles.typeTab,
      index === 0
        ? styles.leftTab
        : index === 3
          ? styles.rightTab
          : {},
      index > 0 && styles.moveLeft1Pix,
      { backgroundColor: type === item ? '#3050ff' : 'transparent' }
    ]
    const handleSetType = (item: string) => {
      setType(item)
    }

    return (
      <View style={styles.typeContainer}>
        {
          types.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={computeStyle(item, index)}
              onPress={() => handleSetType(item)}
            >
              <Text style={[styles.typeTabTxt, { color: type === item ? 'white' : '#666666' }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType='fade'
      onRequestClose={close}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleTxt}>
              {isModify ? '修改账号' : '添加账号'}
            </Text>
            <TouchableOpacity
              style={styles.titleCloseButton}
              onPress={close}
            >
              <Image style={styles.titleCloseImg} source={icon_close_modal} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitleTxt}>账号类型</Text>
          {renderType()}
          <Text style={styles.subTitleTxt}>账号名称</Text>
          <TextInput
            style={styles.input}
            maxLength={20}
            value={name}
            onChangeText={text => {
              setName(text || '');
            }}
          />
          <Text style={styles.subTitleTxt}>账号</Text>
          <TextInput
            style={styles.input}
            maxLength={20}
            value={account}
            onChangeText={text => {
              setAccount(text || '');
            }}
          />
          <Text style={styles.subTitleTxt}>密码</Text>
          <TextInput
            style={styles.input}
            maxLength={20}
            value={password}
            onChangeText={text => {
              setPassword(text || '');
            }}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePress}
          >
            <Text style={styles.saveTxt}>保 存</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
})

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  subTitleTxt: {
    fontSize: 12,
    color: '#666666',
    marginTop: 16,
  },

  titleContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  titleCloseButton: {
    position: 'absolute',
    right: 6,
  },
  titleCloseImg: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  typeContainer: {
    width: '100%',
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  typeTab: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTabTxt: {
    fontSize: 14
  },
  leftTab: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightTab: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  moveLeft1Pix: {
    marginLeft: -1,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
  },
  saveButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#3050ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
    marginBottom: 6,
  },
  saveTxt: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  }
})