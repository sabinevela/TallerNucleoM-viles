import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'

type Game = {
  id: string;
  titulo: string;
  imagen: string;
  precio: number;
  plataforma: string[];
};

export default function GameCatalogScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jritsqmet.github.io/web-api/videojuegos.json')
      .then(response => response.json())
      .then(data => {
        setGames(data.videojuegos || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error en fetch:', error);
        setLoading(false);
      });
  }, []);

  const renderGame = ({ item }: { item: Game }) => (
    <View style={styles.card}>
      {/* Elementos decorativos de la card */}
      <View style={styles.cardGlow}></View>
      <View style={styles.cornerAccent1}></View>
      <View style={styles.cornerAccent2}></View>
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <View style={styles.imageOverlay}></View>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.precio}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.titulo}</Text>
        
        <View style={styles.platformContainer}>
          <Text style={styles.platformLabel}>PLATAFORMAS:</Text>
          <View style={styles.platformTags}>
            {item.plataforma.map((platform, index) => (
              <View key={index} style={styles.platformTag}>
                <Text style={styles.platformText}>{platform}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statusBar}>
          <View style={styles.statusDot}></View>
          <Text style={styles.statusText}>DISPONIBLE</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header del catálogo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 GAME CATALOG</Text>
        <Text style={styles.headerSubtitle}>Explora el universo gaming</Text>
        <View style={styles.headerDivider}></View>
      </View>

      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundElements}>
        <View style={styles.gridPattern1}></View>
        <View style={styles.gridPattern2}></View>
        <View style={styles.floatingOrb}></View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}></View>
          <Text style={styles.loadingText}>CARGANDO CATÁLOGO...</Text>
          <View style={styles.loadingBar}>
            <View style={styles.loadingProgress}></View>
          </View>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGame}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
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
  gridPattern1: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  gridPattern2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '10%',
    width: 1,
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  floatingOrb: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 3,
    textShadowColor: '#00E5FF',
    textShadowRadius: 15,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64FFDA',
    letterSpacing: 1,
    opacity: 0.8,
    marginBottom: 15,
  },
  headerDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#BB86FC',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  listContainer: {
    padding: 15,
    zIndex: 1,
  },
  card: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
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
  cornerAccent1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderTopColor: '#BB86FC',
    opacity: 0.6,
    zIndex: 1,
  },
  cornerAccent2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 25,
    borderBottomWidth: 25,
    borderRightColor: 'transparent',
    borderBottomColor: '#64FFDA',
    opacity: 0.4,
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#64FFDA',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  image: { 
    width: '100%', 
    height: 180,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  priceTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(187, 134, 252, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#BB86FC',
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  contentContainer: {
    padding: 20,
    zIndex: 2,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 15,
    letterSpacing: 1,
    textShadowColor: '#00E5FF',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  platformContainer: {
    marginBottom: 15,
  },
  platformLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.8,
  },
  platformTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformTag: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64FFDA',
  },
  platformText: {
    color: '#64FFDA',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E5FF',
    marginRight: 8,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderTopColor: '#00E5FF',
    marginBottom: 20,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  loadingText: {
    color: '#64FFDA',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  loadingBar: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#64FFDA',
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    backgroundColor: '#64FFDA',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
})