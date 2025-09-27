import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase/Config'

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        set(ref(db, 'users/' + user.uid), {
          email: user.email,
        }).then(() => {
          console.log("Usuario registrado y guardado en DB:", user.email)
          navigation.replace("Drawer")
        }).catch((dbError) => {
          alert("Error guardando en DB: " + dbError.message)
        })
      })
      .catch((error) => {
        alert("Error al registrar: " + error.message)
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundElements}>
        <View style={styles.hexagon1}></View>
        <View style={styles.hexagon2}></View>
        <View style={styles.scanLine}></View>
        <View style={styles.dataStream1}></View>
        <View style={styles.dataStream2}></View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>NEW PLAYER</Text>
        <Text style={styles.subtitle}>Join the Gaming Network</Text>
        <View style={styles.divider}></View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder='Ingresa tu email'
            placeholderTextColor="#64FFDA"
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.inputUnderline}></View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder='Ingresa tu contraseña'
            placeholderTextColor="#64FFDA"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <View style={styles.inputUnderline}></View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title='REGISTRARME' 
            onPress={register}
            color="#BB86FC"
          />
        </View>

        <View style={styles.loginContainer}>
          <Button 
            title='¿Ya tienes una cuenta?, inicia sesión aquí' 
            onPress={()=>navigation.navigate("Login")}
            color="#00E5FF"
          />
        </View>

        <View style={styles.securityBadge}>
          <Text style={styles.securityText}>🛡️ SECURE CONNECTION</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', padding: 20, position: 'relative' },
  backgroundElements: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  hexagon1: { position: 'absolute', top: 120, right: 40, width: 60, height: 60, backgroundColor: 'rgba(187, 134, 252, 0.15)', transform: [{ rotate: '45deg' }], shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 25 },
  hexagon2: { position: 'absolute', bottom: 180, left: 30, width: 80, height: 80, backgroundColor: 'rgba(100, 255, 218, 0.1)', transform: [{ rotate: '30deg' }], shadowColor: '#64FFDA', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30 },
  scanLine: { position: 'absolute', top: '40%', left: 0, right: 0, height: 2, backgroundColor: 'rgba(0, 229, 255, 0.4)', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 },
  dataStream1: { position: 'absolute', top: 0, bottom: 0, left: '15%', width: 1, backgroundColor: 'rgba(187, 134, 252, 0.3)', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  dataStream2: { position: 'absolute', top: 0, bottom: 0, right: '18%', width: 1, backgroundColor: 'rgba(100, 255, 218, 0.3)', shadowColor: '#64FFDA', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  header: { alignItems: 'center', marginBottom: 40, zIndex: 1 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#BB86FC', letterSpacing: 4, textShadowColor: '#BB86FC', textShadowRadius: 15, textShadowOffset: { width: 0, height: 0 }, marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64FFDA', letterSpacing: 2, opacity: 0.9, marginBottom: 20 },
  divider: { width: 100, height: 2, backgroundColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  formContainer: { width: '100%', maxWidth: 320, backgroundColor: 'rgba(18, 18, 18, 0.95)', borderRadius: 25, padding: 35, borderWidth: 2, borderColor: '#BB86FC', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 15, zIndex: 1 },
  inputWrapper: { marginBottom: 25, position: 'relative' },
  inputLabel: { color: '#BB86FC', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, opacity: 0.8 },
  input: { backgroundColor: 'rgba(187, 134, 252, 0.08)', borderWidth: 2, borderColor: '#BB86FC', borderRadius: 15, padding: 16, fontSize: 16, color: '#FFFFFF', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  inputUnderline: { position: 'absolute', bottom: -5, left: 10, right: 10, height: 2, backgroundColor: 'rgba(187, 134, 252, 0.3)', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5 },
  buttonContainer: { marginVertical: 20, borderRadius: 25, overflow: 'hidden', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 15, elevation: 10 },
  loginContainer: { marginTop: 15, borderRadius: 25, overflow: 'hidden', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  securityBadge: { marginTop: 25, alignItems: 'center', backgroundColor: 'rgba(100, 255, 218, 0.1)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: '#64FFDA' },
  securityText: { color: '#64FFDA', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
})
