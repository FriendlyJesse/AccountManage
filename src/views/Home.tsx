import { Image, ImageSourcePropType, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AddAccount, { Ref } from '../components/AddAccount'
import { load } from '../utils/Storage'
import iconAdd from '../assets/icon_add.png'
import iconGame from '../assets/icon_game.png'
import iconPlatform from '../assets/icon_platform.png'
import iconBank from '../assets/icon_bank.png'
import iconOther from '../assets/icon_other.png'
import iconAllow from '../assets/icon_arrow.png'


interface accounts {
  ID: string
  type: string
  name: string
  account: string
  password: string
}

const iconMap: { [key: string]: ImageSourcePropType } = {
  '游戏': iconGame,
  '平台': iconPlatform,
  '银行卡': iconBank,
  '其他': iconOther
}

export default function Home() {
  const addAccountRef = useRef<Ref>()
  const [accounts, setAccounts] = useState<accounts[]>([])
  const gameAccounts = accounts.filter(item => item.type === '游戏')
  const platformAccounts = accounts.filter(item => item.type === '平台')
  const bankAccounts = accounts.filter(item => item.type === '银行卡')
  const otherAccounts = accounts.filter(item => item.type === '其他')

  const sectionData = [
    { type: '游戏', data: gameAccounts },
    { type: '平台', data: platformAccounts },
    { type: '银行卡', data: bankAccounts },
    { type: '其他', data: otherAccounts },
  ]

  type sectionDataType = typeof sectionData[0]

  const getAccounts = async () => {
    const data = await load('accounts')
    setAccounts(data ? JSON.parse(data) : [])
  }

  useEffect(() => {
    getAccounts()
  }, [])

  const renderItem = ({ item: { name, account, password } }: { item: accounts }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTxt}>{ name }</Text>
        <View style={styles.accpwdWrraper}>
          <Text style={styles.accpwdTxt}>账号：{account}</Text>
          <Text style={styles.accpwdTxt}>密码：{password}</Text>
        </View>
      </View>
    )
  }
  const renderSectionHeader = ({ section: { type } }: { section: sectionDataType }) => {
    return (
      <View style={styles.groupHeader}>
        <Image style={styles.typeIcon} source={iconMap[type]} />
        <Text style={styles.typeTxt}>{ type }</Text>
        <TouchableOpacity style={styles.iconAllowContainer}>
          <Image style={styles.iconAllow} source={iconAllow} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleTxt}>账号管理</Text>
      </View>
      
      <SectionList
        contentContainerStyle={styles.containerStyle}
        sections={sectionData} 
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => { addAccountRef.current!.show() }}>
        <Image style={styles.addImg} source={iconAdd}></Image>
      </TouchableOpacity>
      <AddAccount ref={addAccountRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTxt: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold'
  },
  addButton: {
    position: 'absolute',
    bottom: 64,
    right: 28,
  },
  addImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain'
  },
  containerStyle: {
    paddingHorizontal: 12
  },
  groupHeader: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12
  },
  typeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  typeTxt: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16
  },
  iconAllowContainer: {
    position: 'absolute',
    right: 0,
    padding: 16
  },
  iconAllow: {
    width: 20,
    height: 20,
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  itemTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold'
  },
  accpwdWrraper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  accpwdTxt: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 6
  }
})