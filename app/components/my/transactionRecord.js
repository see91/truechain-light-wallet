import React, { Component } from 'react';

import { Text, View, Image, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';

import { withNavigation } from 'react-navigation';
import { getTransactionRecord, getERC20TransactionRecord } from '../../api/index';

class Recording extends Component {
	show(num) {
		num += '';
		num = num.replace(/[^0-9|\.]/g, '');
		if (/^0+/) {
			num = num.replace(/^0+/, '');
		}
		if (!/\./.test(num)) {
			num += '.00000';
		}
		if (/^\./.test(num)) {
			num = '0' + num;
		}
		num += '00000';
		num = num.match(/\d+\.\d{4}/)[0];
		return num;
	}

	render() {
		return (
			<View style={styles.recordDetail_item}>
				<Text>{this.props.to.replace(this.props.to.slice('10', '32'), '......')}</Text>
				<Text>{this.show(this.props.value / 1e18)} ether</Text>
			</View>
		);
	}
}
class TransactionRecordOO extends Component {
	render() {
		return (
			<View style={styles.line}>
				{this.props.data.item.from === store.getState().walletInfo.wallet_address.toLowerCase() ? (
					<View style={styles.recordDetail}>
						<View>
							<Image
								style={styles.record_icon}
								source={require('../../assets/images/asset/expend_3x.png')}
							/>
						</View>
						<Recording to={this.props.data.item.to} value={this.props.data.item.value} />
					</View>
				) : (
					<View style={styles.recordDetail}>
						<View>
							<Image
								style={styles.record_icon}
								source={require('../../assets/images/asset/add_3x.png')}
							/>
						</View>
						<Recording to={this.props.data.item.to} value={this.props.data.item.value} />
					</View>
				)}
			</View>
		);
	}
}
class TransactionRecord extends Component {
	static navigationOptions = {
		headerTitle: '交易记录'
	};

	constructor(props) {
		super(props);
		this.state = {
			recordData: []
		};
	}

	// componentDidMount() {
	// 	getTransactionRecord('0x5833fA6053e6E781EaFb8695d63D90f6B3571e5e').then((res) => {
	// 		this.setState({
	// 			recordData: res.data.result
	// 		});
	// 	});
	// }

	componentDidMount() {
		getTransactionRecord(store.getState().walletInfo.wallet_address).then((res) => {
			this.setState({
				recordData: res.data.result
			});
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList data={this.state.recordData} renderItem={(item) => <TransactionRecordOO data={item} />} />
			</View>
		);
	}
}

export default withNavigation(TransactionRecord);

const styles = StyleSheet.create({
	textAlign: {
		textAlign: 'center'
	},
	color_white: {
		color: '#fff'
	},
	marginTop_20: {
		marginTop: 20
	},
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	balance: {
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#528bf7'
	},
	balance_text_big: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	record: {
		padding: 20,
		position: 'absolute',
		top: 150,
		bottom: 50,
		left: 0,
		right: 0
	},
	recordDetail: {
		height: 75,
		flexDirection: 'row',
		alignItems: 'center'
	},
	record_icon: {
		width: 50,
		height: 50
	},
	recordDetail_item: {
		flex: 1,
		height: 75,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	bottom_fun: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'transparent'
	},
	bottom_fun_item: {
		height: 50,
		lineHeight: 50,
		color: '#fff',
		textAlign: 'center',
		width: Dimensions.get('window').width / 2
	},
	bottom_fun_item_transfer: {
		backgroundColor: '#35ccbf'
	},
	bottom_fun_item_receipt: {
		backgroundColor: '#528bf7'
	},
	line: {
		borderBottomColor: '#ccc',
		borderBottomWidth: 1
	}
});