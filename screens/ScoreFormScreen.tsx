import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ref, push } from 'firebase/database'
import { auth, db } from '../firebase/Config'

type Game = {
  id: string;
  titulo: string;
  imagen: string;
  precio: number;
  plataforma: string[];
}

export default function ScoreFormScreen({ navigation }: any) {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [score, setScore] = useState("")
  const [date, setDate] = useState("")
  const [showGameModal, setShowGameModal] = useState(false)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    fetch('https://jritsqmet.github.io/web-api/videojuegos.json')
      .then(response => response.json())
      .then(data => {
        setGames(data.videojuegos || [])
      })
      .catch(error => {
        console.error('Error fetching games:', error)
      })

    const today = new Date().toISOString().split('T')[0]
    setDate(today)
  }, [])

  const filteredGames = games.filter(game => 
    game.titulo.toLowerCase().includes(searchText.toLowerCase())
  )

  const saveScore = () => {
    if (!selectedGame || !score) {
      Alert.alert("Error", "Debes seleccionar un juego y ingresar un puntaje")
      return
    }

    const scoreValue = parseInt(score)
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 999999) {
      Alert.alert("Error", "El puntaje debe ser un número entre 0 y 999,999")
      return
    }

    const user = auth.currentUser
    if (!user) return

    const scoreData = {
      game: selectedGame.titulo,
      score: scoreValue,
      date: date,
      userId: user.uid,
      gameImage: selectedGame.imagen
    }

    push(ref(db, `users/${user.uid}/scores`), scoreData)
      .then(() => {
        Alert.alert("Éxito", "Puntaje guardado correctamente")
        setSelectedGame(null)
        setScore("")
        setDate(new Date().toISOString().split('T')[0])
        setSearchText("")
      })
      .catch(error => {
        Alert.alert("Error", "Error al guardar el puntaje: " + error.message)
      })
  }

  const selectGame = (game: Game) => {
    setSelectedGame(game)
    setSearchText(game.titulo)
    setShowGameModal(false)
  }

  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.gameItem} onPress={() => selectGame(item)}>
      <Image source={{ uri: item.imagen }} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.titulo}</Text>
        <Text style={styles.gamePlatforms}>{item.plataforma.join(', ')}</Text>
        <Text style={styles.gamePrice}>${item.precio}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.backgroundElements}>
        <View style={styles.glowOrb1}></View>
        <View style={styles.glowOrb2}></View>
        <View style={styles.scanLine}></View>
        <View style={styles.gridLine1}></View>
        <View style={styles.gridLine2}></View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>⚡ NEW SCORE</Text>
        <Text style={styles.subtitle}>Registra tu mejor puntaje</Text>
        <View style={styles.divider}></View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>JUEGO SELECCIONADO</Text>
          <TouchableOpacity 
            style={styles.gameSelector}
            onPress={() => setShowGameModal(true)}
          >
            {selectedGame ? (
              <View style={styles.selectedGameContainer}>
                <Image source={{ uri: selectedGame.imagen }} style={styles.selectedGameImage} />
                <View style={styles.selectedGameInfo}>
                  <Text style={styles.selectedGameTitle}>{selectedGame.titulo}</Text>
                  <Text style={styles.selectedGamePlatform}>{selectedGame.plataforma[0]}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectorPlaceholder}>Toca para seleccionar un juego</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>PUNTAJE</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu puntaje (0-999,999)"
            placeholderTextColor="#64FFDA"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
            maxLength={6}
          />
          <View style={styles.inputGlow}></View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>FECHA</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#64FFDA"
            value={date}
            onChangeText={setDate}
          />
          <View style={styles.inputGlow}></View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveScore}>
          <View style={styles.buttonGlow}></View>
          <Text style={styles.saveButtonText}>🚀 GUARDAR PUNTAJE</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showGameModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SELECCIONAR JUEGO</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowGameModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar juego..."
              placeholderTextColor="#64FFDA"
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredGames}
              renderItem={renderGame}
              keyExtractor={(item) => item.id}
              style={styles.gamesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A0A0A',
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
  glowOrb1: {
    position: 'absolute',
    top: 80,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  glowOrb2: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  scanLine: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(100, 255, 218, 0.4)',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  gridLine1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '20%',
    width: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  gridLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '15%',
    width: 1,
    backgroundColor: 'rgba(187, 134, 252, 0.25)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 3,
    textShadowColor: '#00E5FF',
    textShadowRadius: 15,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64FFDA',
    letterSpacing: 1,
    opacity: 0.8,
    marginBottom: 15,
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: '#BB86FC',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  inputSection: {
    marginBottom: 25,
    position: 'relative',
  },
  label: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
    opacity: 0.9,
  },
  gameSelector: {
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderWidth: 2,
    borderColor: '#00E5FF',
    borderRadius: 15,
    padding: 15,
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedGameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedGameImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  selectedGameInfo: {
    flex: 1,
  },
  selectedGameTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedGamePlatform: {
    color: '#64FFDA',
    fontSize: 12,
    opacity: 0.8,
  },
  selectorPlaceholder: {
    color: '#64FFDA',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00E5FF',
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGlow: {
    position: 'absolute',
    bottom: -2,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  saveButton: {
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    borderWidth: 2,
    borderColor: '#BB86FC',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
  },
  saveButtonText: {
    color: '#BB86FC',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: '#BB86FC',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 255, 0.3)',
  },
  modalTitle: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00E5FF',
    borderRadius: 10,
    padding: 12,
    margin: 15,
    fontSize: 16,
    color: '#FFFFFF',
  },
  gamesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  gameItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  gameImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gamePlatforms: {
    color: '#64FFDA',
    fontSize: 11,
    marginBottom: 2,
  },
  gamePrice: {
    color: '#BB86FC',
    fontSize: 12,
    fontWeight: 'bold',
  },
})