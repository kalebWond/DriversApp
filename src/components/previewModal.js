import React from 'react';
import { Text, TouchableOpacity, Modal, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class PreviewModal extends React.Component {


    render() {
        return (
            <Modal animationType="slide"
                transparent={ false }
                onRequestClose={ this.props.toggleModal }
                visible={this.props.modalVisible}
            >
            <View>
                <View style={{alignItems: "flex-end", marginRight: 20, marginTop: 20}}>
                    <TouchableOpacity onPress={this.props.toggleModal }>
                        <Icon name="close" size={35} style={{marginRight: 20}} color="#333" />                    
                    </TouchableOpacity>
                </View>

                <View style={{height:"90%", alignItems: "center", justifyContent:"center"}}>
                    <Text style={styles.header}>Passenger Details</Text>
                    <View style={styles.details}>

                        <View style={styles.detailGroup}>
                            <Text style={styles.question}>Phone Number</Text>
                            <Text style={styles.answer}>{this.props.data.phoneNumber}</Text>
                        </View>

                        <View style={styles.detailGroup}>
                            <Text style={styles.question}>Destination</Text>
                            <Text style={styles.answer}>{this.props.data.destination}</Text>
                        </View>

                    </View>
                    <TouchableOpacity style={styles.btn}
                        onPress={() => {
                            this.props.toggleModal()
                            this.props.takeIt()
                        }}
                    >
                        <Text style={styles.btnText}>Go</Text>
                    </TouchableOpacity>
                </View>
            </View>

            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        color: "blue",
        fontWeight: "600",
    },
    details: {
        // flex: 1,
        justifyContent: "space-around",
       },
    detailGroup: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 30
    },
    question: {
        width: "45%",
        fontSize: 20
    },
    answer: {
        // width: "50%",
        fontSize: 20,
        fontWeight: "bold",
    },
    btn: {
        padding: 15,
        backgroundColor: '#156fca',
        borderRadius: 5,
        marginTop: 30,
        width: "80%",
        alignItems: "center"
    },
    btnText: {
        fontSize: 20,
        color: "white",
        fontWeight: "600"
    }
})

export default PreviewModal;