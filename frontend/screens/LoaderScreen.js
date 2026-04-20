import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoaderScreen({ navigation }) {
    return (
        <LinearGradient colors={['#FFFFFF', '#FECEE6']} style={{flex: 1}}>
    <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Text Section */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>You'll Never Walk Alone</Text>
                    <Text style={styles.subtitle}>Find your people and grow together</Text>
                    <Text style={styles.title}>Concilio et Labore</Text>
                </View>

                {/* Spacer to push buttons to bottom */}
                <View style={{ flex: 1 }} />

                {/* Buttons Section */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 4,
    },
    bottomContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    button: {
        backgroundColor: '#F58882',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#9CA3AF',
        fontSize: 15,
        marginTop: 8,
    },
});
