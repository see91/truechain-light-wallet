import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import { withNavigation } from 'react-navigation';
import { getTeamInfo, getTeamMember, initStatus } from '../../api/loged';
import { Button } from 'react-native-elements';
import Icon from '../../pages/iconSets';
import { I18n } from '../../../language/i18n';
const screen = Dimensions.get('window');
class TeamMemberList extends Component {
	render() {
		return (
			<View style={styles.memberList}>
				<View style={styles.baseInfo}>
					{this.props.item.role === 2 ? (
						<Icon name="icon-1231zuchang" size={30} color="#4F8EF7" />
					) : (
						<Icon name="icon-geren" size={30} color="#4F8EF7" />
					)}
					<Text style={{ marginLeft: 5 }}>{this.props.item.nickname}</Text>
				</View>
				{this.props.status === 2 ? (
					<Text style={{ color: '#528BF7' }}>{this.props.item.lock_num} TRUE</Text>
				) : null}
			</View>
		);
	}
}

class TeamInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: '2',
			teamAddress: null,
			teamInfoData: {},
			teamMemberData: [],
			nodeType: null,
			Button: null
		};
		this.navigate = this.props.navigation.navigate;
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.state.params.title
	});

	componentDidMount() {
		const { params } = this.props.navigation.state;
		this.setState(
			{
				teamAddress: params.teamAddress,
				nodeType: params.nodeType || '',
				status: params.status
			},
			() => {
				getTeamInfo({
					type: this.state.type,
					address: this.state.teamAddress
				}).then((res) => {
					this.setState({
						teamInfoData: res.data.data[0]
					});
				});
				getTeamMember({
					teamAddress: this.state.teamAddress
				}).then((res) => {
					this.setState({
						teamMemberData: res.data.data
					});
				});
			}
		);

		switch (params.status) {
			case 1:
				this.setState({
					Button: <Button title="已申请" buttonStyle={[ styles.button, styles.alreadyButton ]} />
				});
				break;
			case 2:
				this.setState(
					{
						Button: (
							<View style={styles.rejected}>
								<Text style={styles.applicationReminder_text}>{I18n.t('node.application._success')}</Text>
								{/* 申请已通过，请进行下一步操作 */}
								<Button
									title={I18n.t('public.next')} //"下一步"
									buttonStyle={[ styles.button, styles.buttonStyle ]}
									onPress={() => {
										this.navigate('Lockpositon', {
											type: 1
										});
									}}
								/>
							</View>
						)
					},
					() => {
						this.setState({
							Button: null
						});
					}
				);
				break;
			case 3:
				this.setState({
					Button: (
						<View style={styles.rejected}>
							<Text style={styles.applicationReminder_text}>{I18n.t('node.application._fail')}</Text>
							{/* 申请失败，队长拒绝了您的申请 */}
							<Button
								title="加入其它组队"
								buttonStyle={[ styles.button, styles.buttonStyle ]}
								onPress={() => {
									initStatus().then((res) => {
										this.navigate('Home');
									});
								}}
							/>
						</View>
					)
				});
				break;
			default:
				this.setState({
					Button: (
						<Button
							title={I18n.t('public.next')} //下一步
							buttonStyle={[ styles.button, styles.buttonStyle ]}
							onPress={() => {
								this.navigate('FillInfo', {
									teamAddress: this.state.teamAddress,
									nodeType: this.state.nodeType
								});
							}}
						/>
					)
				});
				break;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.teamInfo}>
					<View style={styles.headerInfo}>
						<View style={styles.headerInfo_item}>
							<Text>{I18n.t('node.teamInfo.teamInfo_Info')}</Text>
							{/* 组队信息 */}
							<Text style={styles.color_999}>{this.state.teamInfoData.nickname}</Text>
						</View>
						<TouchableHighlight style={styles.ticket}>
							<Text style={styles.color_fff}>{this.state.teamInfoData.lock_num}{I18n.t('public.tickets')}</Text>
						</TouchableHighlight>
					</View>
					<View>
						<Text style={[ styles.color_999, styles.marginTop_5 ]}>
							{this.state.teamInfoData.declaration}
						</Text>
					</View>
					<ScrollView style={{ marginTop: 10, height: 200 }}>
						{this.state.teamMemberData.map((item, index) => {
							return <TeamMemberList item={item} key={index} status={this.state.status} />;
						})}
					</ScrollView>
				</View>
				<View style={styles.next}>{this.state.Button}</View>
			</View>
		);
	}
}

export default withNavigation(TeamInfo);

const styles = StyleSheet.create({
	color_fff: {
		color: '#fff'
	},
	color_999: {
		color: '#999999'
	},
	marginTop_5: {
		marginTop: 5
	},
	container: {
		flex: 1,
		padding: 15
	},
	teamInfo: {
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 8
	},
	headerInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	headerInfo_item: {
		justifyContent: 'space-between',
		height: 35
	},
	ticket: {
		backgroundColor: '#528bf7',
		padding: 5,
		borderRadius: 50
	},
	memberList: {
		height: 35,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#E6E6E6',
		justifyContent: 'space-between'
	},
	baseInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	avatar: {
		width: 20,
		height: 20
	},
	next: {
		alignItems: 'center',
		marginTop: 50
	},
	button: {
		width: 260,
		height: 45,
		borderRadius: 30
	},
	buttonStyle: {
		backgroundColor: '#528bf7'
	},
	alreadyButton: {
		backgroundColor: '#ccc'
	},
	rejected: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	applicationReminder_text: {
		marginBottom: 20,
		color: '#666'
	}
});
