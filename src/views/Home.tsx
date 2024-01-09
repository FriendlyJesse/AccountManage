import {
  Alert,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AddAccount, {Ref} from '../components/AddAccount';
import {load, save} from '../utils/Storage';
import iconAdd from '../assets/icon_add.png';
import iconGame from '../assets/icon_game.png';
import iconPlatform from '../assets/icon_platform.png';
import iconBank from '../assets/icon_bank.png';
import iconOther from '../assets/icon_other.png';
import iconAllow from '../assets/icon_arrow.png';

export interface account {
  ID: string;
  type: string;
  name: string;
  account: string;
  password: string;
}

type typeMap = '游戏' | '平台' | '银行卡' | '其它';
const iconMap: {[key: string]: ImageSourcePropType} = {
  游戏: iconGame,
  平台: iconPlatform,
  银行卡: iconBank,
  其它: iconOther,
};

export default function Home() {
  const addAccountRef = useRef<Ref>();
  const [accounts, setAccounts] = useState<account[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const gameAccounts = accounts.filter(item => item.type === '游戏');
  const platformAccounts = accounts.filter(item => item.type === '平台');
  const bankAccounts = accounts.filter(item => item.type === '银行卡');
  const otherAccounts = accounts.filter(item => item.type === '其它');

  const sectionData = [
    {type: '游戏', data: gameAccounts},
    {type: '平台', data: platformAccounts},
    {type: '银行卡', data: bankAccounts},
    {type: '其它', data: otherAccounts},
  ];

  type sectionDataType = (typeof sectionData)[0];

  const getAccounts = async () => {
    const data = await load('accounts');
    LayoutAnimation.easeInEaseOut();
    setAccounts(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const [sectionState, setSectionState] = useState({
    游戏: true,
    平台: true,
    银行卡: true,
    其它: true,
  });
  const handleSectionPress = (type: typeMap) => {
    const newSectionState = {
      ...sectionState,
      [type]: !sectionState[type],
    };
    LayoutAnimation.easeInEaseOut();
    setSectionState(newSectionState);
  };
  const handleDelete = (ID: string, name: string) => {
    const buttons = [
      {text: '取消'},
      {text: '确定', onPress: () => deleteAccount(ID)},
    ];
    Alert.alert('提示', `确定删除${name}账号吗？`, buttons);
  };
  const deleteAccount = async (ID: string) => {
    const newAccounts = accounts.filter(item => item.ID !== ID);
    await save('accounts', JSON.stringify(newAccounts));
    getAccounts();
  };

  const renderItem = ({
    item: {ID, type, name, account, password},
  }: {
    item: account;
  }) => {
    if (!sectionState[type as typeMap]) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => addAccountRef.current?.show(ID)}
        onLongPress={() => handleDelete(ID, name)}>
        <Text style={styles.itemTxt}>{name}</Text>
        <View style={styles.accpwdWrraper}>
          <Text style={styles.accpwdTxt}>账号：{account}</Text>
          <Text style={styles.accpwdTxt}>
            密码：{showPassword ? password : '********'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderSectionHeader = ({
    section: {type, data},
  }: {
    section: sectionDataType;
  }) => {
    return (
      <View
        style={[
          styles.groupHeader,
          (!data.length || !sectionState[type as typeMap]) &&
            styles.groupHeaderSpecial,
        ]}>
        <Image style={styles.typeIcon} source={iconMap[type]} />
        <Text style={styles.typeTxt}>{type}</Text>
        <TouchableOpacity
          style={styles.iconAllowContainer}
          onPress={() => handleSectionPress(type as typeMap)}>
          <Image
            style={[
              styles.iconAllow,
              {
                transform: [
                  {rotate: sectionState[type as typeMap] ? '0deg' : '-90deg'},
                ],
              },
            ]}
            source={iconAllow}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleTxt}>账号管理</Text>
        <Switch
          style={styles.switch}
          value={showPassword}
          onValueChange={value => setShowPassword(value)}
        />
      </View>

      <SectionList
        contentContainerStyle={styles.containerStyle}
        sections={sectionData}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          addAccountRef.current!.show();
        }}>
        <Image style={styles.addImg} source={iconAdd} />
      </TouchableOpacity>
      <AddAccount onSave={getAccounts} ref={addAccountRef} />
    </View>
  );
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleTxt: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  switch: {
    position: 'absolute',
    right: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 64,
    right: 28,
  },
  addImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  containerStyle: {
    paddingHorizontal: 12,
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
    marginTop: 12,
  },
  groupHeaderSpecial: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  typeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  typeTxt: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  iconAllowContainer: {
    position: 'absolute',
    right: 0,
    padding: 16,
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
    borderTopColor: '#e0e0e0',
  },
  itemTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  accpwdWrraper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accpwdTxt: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 6,
  },
});
