import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function HomeScreen({ navigation }:any) {
  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundElements}>
        <View style={styles.orb1}></View>
        <View style={styles.orb2}></View>
        <View style={styles.orb3}></View>
        <View style={styles.gridLine1}></View>
        <View style={styles.gridLine2}></View>
        <View style={styles.gridLine3}></View>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>⚡ NEXUS ⚡</Text>
        </View>

        <Text style={styles.title}>BIENVENIDO</Text>
        <Text style={styles.subtitle}>Tu aventura gaming comienza aquí</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>EMPEZAR</Text>
          <View style={styles.buttonGlow}></View>
        </TouchableOpacity>

        <View style={styles.statusBar}>
          <View style={styles.statusDot}></View>
          <Text style={styles.statusText}>SISTEMA ONLINE</Text>
          <View style={styles.statusDot}></View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  orb1: {
    position: 'absolute',
    top: 80,
    left: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  orb2: {
    position: 'absolute',
    top: 200,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  orb3: {
    position: 'absolute',
    bottom: 120,
    left: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 35,
  },
  gridLine1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  gridLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '20%',
    width: 1,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  gridLine3: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '25%',
    width: 1,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 40,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00E5FF',
    borderRadius: 15,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 2,
    textShadowColor: '#00E5FF',
    textShadowRadius: 15,
    textShadowOffset: { width: 0, height: 0 },
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    letterSpacing: 4,
    textShadowColor: '#00E5FF',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64FFDA',
    marginBottom: 50,
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.9,
  },
  button: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00E5FF',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: '#00E5FF',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
    textAlign: 'center',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 28,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#64FFDA',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64FFDA',
    marginHorizontal: 10,
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusText: {
    color: '#64FFDA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
})