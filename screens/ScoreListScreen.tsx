import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ref, onValue, remove } from 'firebase/database'
import { auth, db } from '../firebase/Config'

type Score = {
  id: string;
  game: string;
  score: number;
  date: string;
  gameImage?: string;
}

type Statistics = {
  totalScore: number;
  highestScore: number;
  averageScore: number;
  totalGames: number;
  mostPlayedGame: string;
}

export default function ScoreListScreen() {
  const [scores, setScores] = useState<Score[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalScore: 0,
    highestScore: 0,
    averageScore: 0,
    totalGames: 0,
    mostPlayedGame: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const scoresRef = ref(db, `users/${user.uid}/scores`)
    
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const scoresArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        
        scoresArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setScores(scoresArray)
        calculateStatistics(scoresArray)
      } else {
        setScores([])
        setStatistics({
          totalScore: 0,
          highestScore: 0,
          averageScore: 0,
          totalGames: 0,
          mostPlayedGame: ''
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const calculateStatistics = (scoresArray: Score[]) => {
    if (scoresArray.length === 0) return

    const totalScore = scoresArray.reduce((sum, score) => sum + score.score, 0)
    const highestScore = Math.max(...scoresArray.map(score => score.score))
    const averageScore = totalScore / scoresArray.length

    const gameCounts = scoresArray.reduce((acc, score) => {
      acc[score.game] = (acc[score.game] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostPlayedGame = Object.keys(gameCounts).reduce((a, b) => 
      gameCounts[a] > gameCounts[b] ? a : b, ''
    )

    setStatistics({
      totalScore,
      highestScore,
      averageScore,
      totalGames: scoresArray.length,
      mostPlayedGame
    })
  }

  const deleteScore = (scoreId: string, gameName: string) => {
    Alert.alert(
      "Eliminar Puntaje",
      `¿Estás seguro de eliminar el puntaje de ${gameName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const user = auth.currentUser
            if (!user) return
            
            remove(ref(db, `users/${user.uid}/scores/${scoreId}`))
              .then(() => {
                Alert.alert("Éxito", "Puntaje eliminado correctamente")
              })
              .catch((error) => {
                Alert.alert("Error", "Error al eliminar el puntaje: " + error.message)
              })
          }
        }
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderScore = ({ item }: { item: Score }) => (
    <View style={styles.scoreCard}>
      <View style={styles.cardGlow}></View>
      <View style={styles.cardBorder}></View>
      
      <View style={styles.scoreHeader}>
        {item.gameImage && (
          <Image source={{ uri: item.gameImage }} style={styles.gameImage} />
        )}
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{item.game}</Text>
          <Text style={styles.scoreDate}>{formatDate(item.date)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteScore(item.id, item.game)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.scoreDisplay}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{item.score.toLocaleString()}</Text>
          <Text style={styles.scoreLabel}>PUNTOS</Text>
        </View>
        <View style={styles.scoreMeter}>
          <View style={[styles.scoreBar, { width: `${Math.min((item.score / statistics.highestScore) * 100, 100)}%` }]}></View>
        </View>
      </View>
    </View>
  )

  const StatCard = ({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) => (
    <View style={[styles.statCard, { borderColor: color }]}>
      <View style={[styles.statGlow, { backgroundColor: `${color}20` }]}></View>
      <Text style={[styles.statTitle, { color }]}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.backgroundElements}>
        <View style={styles.floatingShape1}></View>
        <View style={styles.floatingShape2}></View>
        <View style={styles.energyLine1}></View>
        <View style={styles.energyLine2}></View>
        <View style={styles.hologramGrid}></View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>📊 SCOREBOARD</Text>
        <Text style={styles.subtitle}>Tu historial de conquistas</Text>
        <View style={styles.divider}></View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingRing}></View>
          <Text style={styles.loadingText}>ANALIZANDO DATOS...</Text>
        </View>
      ) : (
        <>
          <View style={styles.statisticsContainer}>
            <Text style={styles.statsTitle}>⚡ ESTADÍSTICAS GLOBALES</Text>
            <View style={styles.statsGrid}>
              <StatCard 
                title="TOTAL"
                value={statistics.totalScore.toLocaleString()}
                subtitle="Puntos acumulados"
                color="#00E5FF"
              />
              <StatCard 
                title="RÉCORD"
                value={statistics.highestScore.toLocaleString()}
                subtitle="Puntaje más alto"
                color="#BB86FC"
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard 
                title="PROMEDIO"
                value={Math.round(statistics.averageScore).toLocaleString()}
                subtitle="Por juego"
                color="#64FFDA"
              />
              <StatCard 
                title="JUEGOS"
                value={statistics.totalGames.toString()}
                subtitle="Registrados"
                color="#FF6B6B"
              />
            </View>
            {statistics.mostPlayedGame && (
              <View style={styles.favoriteGame}>
                <Text style={styles.favoriteLabel}>🎮 JUEGO FAVORITO</Text>
                <Text style={styles.favoriteValue}>{statistics.mostPlayedGame}</Text>
              </View>
            )}
          </View>

          <View style={styles.scoresSection}>
            <Text style={styles.sectionTitle}>🏆 HISTORIAL DE PUNTAJES</Text>
            {scores.length > 0 ? (
              <FlatList
                data={scores}
                renderItem={renderScore}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scoresList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎯</Text>
                <Text style={styles.emptyTitle}>Sin puntajes registrados</Text>
                <Text style={styles.emptySubtitle}>¡Comienza a registrar tus mejores puntuaciones!</Text>
              </View>
            )}
          </View>
        </>
      )}
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
  floatingShape1: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  floatingShape2: {
    position: 'absolute',
    bottom: 200,
    left: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  energyLine1: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(100, 255, 218, 0.3)',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  energyLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '12%',
    width: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.25)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  hologramGrid: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
    transform: [{ rotate: '45deg' }],
  },
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 30,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderTopColor: '#00E5FF',
    marginBottom: 20,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
  },
  loadingText: {
    color: '#64FFDA',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  statisticsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  statsTitle: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#00E5FF',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderRadius: 15,
    borderWidth: 2,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.9,
    zIndex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 0 },
    zIndex: 1,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#64FFDA',
    opacity: 0.7,
    textAlign: 'center',
    zIndex: 1,
  },
  favoriteGame: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderWidth: 2,
    borderColor: '#BB86FC',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  favoriteLabel: {
    color: '#BB86FC',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
    opacity: 0.9,
  },
  favoriteValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#BB86FC',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  scoresSection: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  sectionTitle: {
    color: '#BB86FC',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    textShadowColor: '#BB86FC',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  scoresList: {
    paddingBottom: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    zIndex: 0,
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderTopColor: '#64FFDA',
    opacity: 0.4,
    zIndex: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
    zIndex: 2,
  },
  gameImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#64FFDA',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 0 },
  },
  scoreDate: {
    color: '#64FFDA',
    fontSize: 12,
    opacity: 0.8,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  deleteText: {
    fontSize: 16,
  },
  scoreDisplay: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    zIndex: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00E5FF',
    textShadowColor: '#00E5FF',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64FFDA',
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.8,
  },
  scoreMeter: {
    height: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  scoreBar: {
    height: '100%',
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
    opacity: 0.3,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtitle: {
    color: '#64FFDA',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
})