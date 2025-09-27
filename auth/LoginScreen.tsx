import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/Config'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = () => {
    if (!email || !password) {
      alert("Debes ingresar email y contraseña")
      return
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log("Usuario logueado con:", user.email)
        navigation.replace("Drawer")
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          alert("Usuario no registrado")
        } else if (error.code === "auth/wrong-password") {
          alert("Contraseña incorrecta")
        } else if (error.code === "auth/invalid-email") {
          alert("Email inválido")
        } else {
          alert("Error al iniciar sesión: " + error.message)
        }
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GAME LOGIN</Text>
        <Text style={styles.subtitle}>Enter the Gaming Universe</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor="#64FFDA"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor="#64FFDA"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="INGRESAR"
            onPress={login}
            color="#00E5FF"
          />
        </View>

        <View style={styles.registerContainer}>
          <Button
            title="¿No tienes una cuenta?, Regístrate aquí."
            onPress={() => navigation.navigate("Register")}
            color="#BB86FC"
          />
        </View>
      </View>

      <View style={styles.decorativeElements}>
        <View style={styles.glowCircle1}></View>
        <View style={styles.glowCircle2}></View>
        <View style={styles.glowLine}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', padding: 20, position: 'relative' },
  header: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#00E5FF', letterSpacing: 3, textShadowColor: '#00E5FF', textShadowRadius: 10, textShadowOffset: { width: 0, height: 0 }, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#64FFDA', letterSpacing: 1, opacity: 0.8 },
  formContainer: { width: '100%', maxWidth: 300, backgroundColor: 'rgba(18, 18, 18, 0.9)', borderRadius: 20, padding: 30, borderWidth: 1, borderColor: '#00E5FF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  input: { backgroundColor: 'rgba(0, 229, 255, 0.1)', borderWidth: 2, borderColor: '#00E5FF', borderRadius: 15, padding: 15, marginBottom: 20, fontSize: 16, color: '#FFFFFF', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonContainer: { marginVertical: 15, borderRadius: 25, overflow: 'hidden', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
  registerContainer: { marginTop: 20, borderRadius: 25, overflow: 'hidden', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  decorativeElements: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 },
  glowCircle1: { position: 'absolute', top: 100, right: 50, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0, 229, 255, 0.1)', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30 },
  glowCircle2: { position: 'absolute', bottom: 150, left: 30, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(187, 134, 252, 0.1)', shadowColor: '#BB86FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 25 },
  glowLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(100, 255, 218, 0.3)', shadowColor: '#64FFDA', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15 },
})
