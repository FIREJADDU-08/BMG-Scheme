import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Color } from '../../utils/Global_Styles';// Ensure Color is defined in your styles
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native'; 
import { colors, alignment } from '../../utils';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { BackHeader } from '../../components';

// Custom Picker Component
const CustomPicker = ({ selectedValue, onValueChange, items, placeholder = "Select an option", enabled = true }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');

    useEffect(() => {
        const selected = items.find(item => item.value === selectedValue);
        setSelectedLabel(selected ? selected.label : placeholder);
    }, [selectedValue, items, placeholder]);

    const handleSelect = (item) => {
        onValueChange(item.value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity 
                style={[styles.pickerButton, !enabled && styles.pickerDisabled]} 
                onPress={() => enabled && setModalVisible(true)}
            >
                <Text style={[styles.pickerText, selectedValue ? {} : styles.placeholderText]}>
                    {selectedLabel}
                </Text>
                <View style={styles.pickerIcon}>
                    <Text style={styles.pickerIconText}>▼</Text>
                </View>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select State</Text>
                            <TouchableOpacity 
                                style={styles.closeButtonContainer}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        item.value === selectedValue && styles.selectedModalItem
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        item.value === selectedValue && styles.selectedModalItemText
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const AddNewMember = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [scheme, setScheme] = useState('');
    const navigation = useNavigation();
    const [selectedGroupcodetObj, setSelectedGroupcodeObj] = useState(null);
    const [selectedCurrentRegcodetObj, setSelectedCurrentRegObj] = useState(null);
    const [namePrefix, setNamePrefix] = useState('Mr');
    const [initial, setInitial] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [doorNo, setDoorNo] = useState('');
    const [loading, setLoading] = useState(true);
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('India');
    const [mobile, setMobile] = useState('');
    const [isMobileValid, setIsMobileValid] = useState(true);
    const [email, setEmail] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [schemes, setSchemes] = useState([]);
    const [amounts, setAmounts] = useState([]);
    const [selectedSchemeId, setSelectedSchemeId] = useState(null);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [amount, setAmount] = useState('');
    const [accCode, setAccCode] = useState('');
    const [modePay, setModepay] = useState('C');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateText, setDateText] = useState('Select Date');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyData, setCompanyData] = useState(null);
    const [cities, setCities] = useState([]); // Add cities state

    const handleBack = () => {
        navigation.navigate('MainLanding');
    };

    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
        'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
        'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
        'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 
        'Delhi', 'Puducherry'
    ];

    const route = useRoute();
    const { schemeId } = route.params || {};

    useEffect(() => {
        if (schemeId) {
            setSelectedSchemeId(schemeId);
        }
    }, [schemeId]);

    // Fetch schemes when the component mounts
    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await fetch('https://akj.brightechsoftware.com/v1/api/member/scheme');
                const data = await response.json();
                const formattedSchemes = data.map(s => ({
                    id: s.SchemeId,
                    name: s.schemeName,
                    description: s.SchemeSName,
                }));
                setSchemes(formattedSchemes);
            } catch (error) {
                console.error('Error fetching schemes:', error);
            }
        };

        fetchSchemes();
    }, []);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await fetch('https://akj.brightechsoftware.com/v1/api/company');
                const data = await response.json();
                if (data && data.length > 0) {
                    setCompanyData(data.message);
                }
                console.log(data.message)
            } catch (error) {
                console.error('Error fetching company data:', error);
                Alert.alert('Error', 'Failed to fetch company details');
            }
        };

        fetchCompanyData();
    }, []);

    useEffect(() => {
        const fetchTransactionTypes = async () => {
            try {
                const response = await fetch('https://akj.brightechsoftware.com/v1/api/account/getTranType');
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                setTransactionTypes(data);
            } catch (error) {
                console.error('Error fetching transaction types:', error);
            }
        };
        fetchTransactionTypes();
    }, []);

    // Fetch amounts when a scheme is selected
    useEffect(() => {
        const fetchAmount = async (schemeId) => {
            if (!schemeId) return;
            console.log('Fetching amounts for schemeId:', schemeId);
    
            setLoading(true);
    
            try {
                const response = await fetch(`https://akj.brightechsoftware.com/v1/api/member/schemeid?schemeId=${schemeId}`);
                const data = await response.json();
    
                if (data.length === 0) {
                    console.warn(`No data returned for schemeId: ${schemeId}`);
                    setAmounts([]);
                    setAmount('');
                    return;
                }
    
                console.log('Fetched amounts data:', data);
    
                const mappedAmounts = data.map(item => ({
                    label: item.GROUPCODE,
                    value: item.AMOUNT,
                    groupCode: item.GROUPCODE,
                    currentRegNo: item.CURRENTREGNO,
                }));
    
                setAmounts(mappedAmounts);
                setAmount(mappedAmounts[0]?.value || '');
                setSelectedGroupcodeObj(mappedAmounts[0]?.groupCode || '');
                setSelectedCurrentRegObj(mappedAmounts[0]?.currentRegNo || '');
            } catch (error) {
                console.error('Error fetching amounts:', error);
            } finally {
                setLoading(false);
            }
        };
    
        if (selectedSchemeId) {
            fetchAmount(selectedSchemeId);
        }
    }, [selectedSchemeId]);

    console.log(selectedSchemeId, '...............')

    const handleSubmit = async () => {
        if (isSubmitting) {
            console.log('Form is already submitting...');
            return;
        }
    
        setIsSubmitting(true);

        // Pincode validation (6 digits)
        if (!/^\d{6}$/.test(pincode)) {
            Alert.alert('Error', 'Please enter a valid 6-digit pincode.');
            setIsSubmitting(false);
            return;
        }
    
        // Mobile number validation (10 digits, starting with 6-9)
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number starting with 6-9.');
            setIsSubmitting(false);
            return;
        }
    
        // PAN number validation (5 uppercase letters, 4 numbers, 1 uppercase letter)
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
            alert('Please enter a valid PAN number (e.g., ABCDE1234F).');
            setIsSubmitting(false);
            return;
        }
    
        // Aadhaar validation (12 digits)
        if (!/^\d{12}$/.test(aadharNumber)) {
            alert('Please enter a valid 12-digit Aadhaar number.');
            setIsSubmitting(false);
            return;
        }

        // Email validation
        if (!email.includes('@')) {
            alert('Email should contain "@" symbol.');
            setIsSubmitting(false);
            return;
        }
    
        // Country validation (ensure country is India)
        if (country !== 'India') {
            alert('Country should be India.');
            setIsSubmitting(false);
            return;
        }
    
        // City validation (check if city is valid from the list of cities)
        if (cities.length === 0 || !cities.includes(city)) {
            alert('Please select a valid city from the list of cities for the given pincode.');
            setIsSubmitting(false);
            return;
        }
    
        // Prepare the request body
        const newMember = {
            title: namePrefix,
            initial,
            pName: name,
            sName: surname,
            doorNo,
            address1,
            address2,
            area,
            city,
            state: selectedState, // Use selectedState instead of state
            country,
            pinCode: pincode,
            mobile,
            idProof: aadharNumber,
            idProofNo: panNumber,
            dob,
            email,
            upDateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            userId: '999',
            appVer: '19.12.10.1',
        };
    
        const createSchemeSummary = {
            schemeId: selectedSchemeId,
            groupCode: selectedGroupcodetObj,
            regNo: selectedCurrentRegcodetObj,
            joinDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            upDateTime2: new Date().toISOString().slice(0, 19).replace('T', ' '),
            openingDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            userId2: '9999',
        };
    
        const schemeCollectInsert = {
            amount: amount,
            modePay: modePay,
            accCode: accCode
        };
    
        const requestBody = {
            newMember,
            createSchemeSummary,
            schemeCollectInsert
        };
    
        try {
            console.log('Request body:', requestBody);
    
            const response = await fetch('https://akj.brightechsoftware.com/v1/api/member/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            console.log('API response status:', response.status);
    
            if (!response.ok) {
                throw new Error('Error creating member: ' + response.statusText);
            }
    
            alert('Member added successfully!');
            resetFormFields();
            navigation.navigate('VerifyMpinScreen');
    
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Function to reset form fields after successful submission
    const resetFormFields = () => {
        setScheme('');
        setSelectedGroupcodeObj(null);
        setSelectedCurrentRegObj(null);
        setInitial('');
        setName('');
        setSurname('');
        setDoorNo('');
        setAddress1('');
        setAddress2('');
        setArea('');
        setCity('');
        setSelectedState(''); // Reset selectedState
        setState('');
        setCountry('India');
        setPincode('');
        setMobile('');
        setDob(new Date());
        setDateText('Select Date');
        setEmail('');
        setPanNumber('');
        setAadharNumber('');
        setAmounts([]);
        setAmount('');
        setAccCode('');
        setModepay('C');
        setSelectedSchemeId(null);
    };

    useEffect(() => {
        if (schemes.length > 0) {
            const defaultSchemeId = schemes[0].id;
            setSelectedSchemeId(defaultSchemeId);
        }
        console.log(amount, '...............')
    }, [schemes]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
        
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            setDateText(formattedDate);
        }
    };

    const showPicker = () => {
        setShowDatePicker(true);
    };

    const renderDatePicker = () => {
        return (
            <View>
                <Text style={styles.label}>
                    Date of Birth <Text style={styles.asterisk}>*</Text>
                </Text>
                
                <TouchableOpacity 
                    onPress={showPicker} 
                    style={styles.dateInput}
                >
                    <Text style={dateText === 'Select Date' ? styles.placeholderText : styles.dateText}>
                        {dateText}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                    />
                )}
            </View>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={{ marginBottom: 100 }}>
                        <BackHeader 
                            title="Member Details"
                            backPressed={() => navigation.goBack()}
                        />
                        
                        <Text style={styles.label}>Initial  <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setInitial}
                            value={initial}
                            placeholder="Enter Initial"
                        /></View>
                        
                        <Text style={styles.label}>First Name <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setName}
                            value={name}
                            placeholder="Enter First Name"
                        /></View>
                        
                        <Text style={styles.label}>Surname <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSurname}
                            value={surname}
                            placeholder="Enter Surname"
                        /></View>
                        
                        <Text style={styles.label}>Door No <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setDoorNo}
                            value={doorNo}
                            placeholder="Enter Door No"
                        /></View>
                        
                        <Text style={styles.label}>Address 1 <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress1}
                            value={address1}
                            placeholder="Enter Address 1"
                        /></View>
                        
                        <Text style={styles.label}>Address 2</Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress2}
                            value={address2}
                            placeholder="Enter Address 2"
                        /></View>
                        
                        <Text style={styles.label}>Area <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setArea}
                            value={area}
                            placeholder="Enter Area"
                        /></View>
                        
                        <Text style={styles.label}>City <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCity}
                            value={city}
                            placeholder="Enter City"
                        /></View>
                       
                        <Text style={styles.label}>State <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.pickerWrapper}>
                            <CustomPicker
                                selectedValue={selectedState}
                                onValueChange={(itemValue) => setSelectedState(itemValue)}
                                items={[
                                    { label: "Select a State", value: "" },
                                    ...states.map(state => ({ label: state, value: state }))
                                ]}
                                placeholder="Select a State"
                            />
                        </View>
                        
                        <Text style={styles.label}>Country <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCountry}
                            value={country}
                            placeholder="Enter Country"
                        /></View>
                        
                        <Text style={styles.label}>Pincode <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPincode}
                            value={pincode}
                            placeholder="Enter Pincode"
                            keyboardType="numeric"
                        /></View>
                        
                        <Text style={styles.label}>Mobile Number <Text style={styles.asterisk}>*</Text></Text>
                        <View style={[styles.inputWrapper, !isMobileValid && styles.inputError]}>
                            <View style={styles.mobileInputContainer}>
                                <Text style={styles.countryCode}>+91</Text>
                                <TextInput
                                    style={[styles.input, styles.mobileInput]}
                                    onChangeText={handleMobileChange}
                                    value={mobile}
                                    placeholder="Enter 10-digit Mobile Number"
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>
                            {!isMobileValid && mobile.length > 0 && (
                                <Text style={styles.errorText}>Please enter a valid 10-digit mobile number starting with 6-9</Text>
                            )}
                        </View>
                        
                        {renderDatePicker()}
                        
                        <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Enter Email"
                        /></View>
                        
                        <Text style={styles.label}>PAN Number <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPanNumber}
                            value={panNumber}
                            placeholder="Enter PAN Number"
                        /></View>
                        
                        <Text style={styles.label}>Aadhaar Number <Text style={styles.asterisk}>*</Text></Text>
                        <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAadharNumber}
                            value={aadharNumber}
                            placeholder="Enter Aadhaar Number"
                            keyboardType="numeric"
                        /></View>
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={() => setCurrentStep(2)}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <>
                        <Text style={styles.label}>Scheme Selection</Text>
                        <View style={[styles.inputWrapper, { justifyContent: 'center' }]}>
                            <Text style={[styles.input, { textAlignVertical: 'center', textAlign: 'left', paddingVertical: 0 }]}>
                                {schemes.find(s => s.id === selectedSchemeId)?.name || "No scheme selected"}
                            </Text>
                        </View>

                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.pickerWrapper}>
                            <CustomPicker
                                selectedValue={amount}
                                onValueChange={itemValue => {
                                    const selectedAmount = amounts.find(amt => amt.value === itemValue);
                                    setAmount(itemValue);

                                    if (selectedAmount) {
                                        setSelectedGroupcodeObj(selectedAmount.groupCode);
                                        setSelectedCurrentRegObj(selectedAmount.currentRegNo);
                                    }
                                }}
                                items={amounts.map(amt => ({ label: amt.value, value: amt.value }))}
                                placeholder="Select Amount"
                                enabled={!isSubmitting}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Payment Mode</Text>
                            <View style={styles.pickerWrapper}>
                                <CustomPicker
                                    selectedValue={accCode}
                                    onValueChange={itemValue => {
                                        setAccCode(itemValue);
                                        const selectedType = transactionTypes.find(type => type.ACCOUNT === itemValue);
                                        if (selectedType && selectedType.CARDTYPE) {
                                            setModepay(selectedType.CARDTYPE);
                                        }
                                    }}
                                    items={transactionTypes.map(type => ({ label: type.NAME, value: type.ACCOUNT }))}
                                    placeholder="Select Payment Mode"
                                    enabled={!isSubmitting}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#fff" />
                                        <Text style={[styles.buttonText, styles.loadingText]}>
                                            Submitting...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.buttonText}>Submit</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                onPress={() => setCurrentStep(1)}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );
            default:
                return null;
        }
    };

    const handleMobileChange = (text) => {
        const cleanedText = text.replace(/\D/g, '');
        
        if (cleanedText.length <= 10) {
            setMobile(cleanedText);
            setIsMobileValid(/^[6-9]\d{9}$/.test(cleanedText) || cleanedText.length === 0);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {renderStep()}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.white
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        justifyContent: 'center',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    inputWrapper: {
        backgroundColor: colors.white, // Background color for the shadow to appear
        borderRadius: 10,
        elevation: 6, // Shadow for Android
        shadowColor: colors.greenColor, // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        marginBottom: 15,
    },
    input: {
        height: 60,
        borderColor: colors.greenColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.white, // Keep the background consistent
        
    },
    picker: {
        height: 60,
        width: '100%',
        marginBottom: 15,
    },
    pickerWrapper: {
        height: 60,
        borderColor: colors.greenColor,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: colors.white,
        elevation: 6,
        shadowColor: colors.greenColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
    button: {
        backgroundColor: colors.greenColor,
        flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    height: 60,
    padding: 20,
     justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        color:colors.fontMainColor,
        fontSize: 16,
        fontWeight: 'bold'
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 10,
    },
    buttonDisabled: {
        backgroundColor: Color.blue + '80', // Add transparency to show disabled state
        opacity: 0.8,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
      },
      schemeText: {
        fontSize: 16,
        color: colors.greenColor,
        marginTop: -10,
        ...alignment.PxSmall
      },
      asterisk: {
        color: colors.yellow,
        fontSize: 16,
      },
    mobileInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.greenColor,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    countryCode: {
        fontSize: 16,
        color: colors.greenColor,
        marginRight: 5,
        fontWeight: 'bold',
    },
    mobileInput: {
        flex: 1,
        borderWidth: 0,
        marginLeft: 5,
    },
    inputError: {
        borderColor: colors.yellow,
        shadowColor: colors.yellow,
    },
    errorText: {
        color: colors.yellow,
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '500',
    },
    dateInput: {
        height: 60,
        borderWidth: 1,
        borderColor: colors.greenColor,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: colors.white,
        elevation: 6,
        shadowColor: colors.greenColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    dateText: {
        color: '#000',
        fontSize: 16,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
       
        borderColor: colors.greenColor,
        borderRadius: 10,
        paddingHorizontal: 15,
        
       
    },
    pickerText: {
        fontSize: 16,
        color: colors.black,
        flex: 1,
    },
    pickerIcon: {
        marginLeft: 10,
    },
    pickerIconText: {
        fontSize: 12,
        color: colors.greenColor,
    },
    pickerDisabled: {
        opacity: 0.5,
        backgroundColor: '#f5f5f5',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
        elevation: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.greenColor,
    },
    closeButtonContainer: {
        padding: 5,
    },
    closeButton: {
        fontSize: 20,
        color: colors.greenColor,
        fontWeight: 'bold',
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedModalItem: {
        backgroundColor: colors.greenColor + '20',
    },
    modalItemText: {
        fontSize: 16,
        color: colors.black,
    },
    selectedModalItemText: {
        color: colors.greenColor,
        fontWeight: 'bold',
    },
});

export default AddNewMember;
