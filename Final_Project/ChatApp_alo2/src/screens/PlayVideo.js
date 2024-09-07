import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { useRoute } from "@react-navigation/native";

const PlayVideo = () => {
    const route = useRoute();
    const { uri } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isImage, setIsImage] = useState(false);
    const [error, setError] = useState(null);
    console.log("uri", uri);

    useEffect(() => {
        let isMounted = true; // To track if the component is mounted

        fetch(uri)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load media');
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith('video')) {
                    setIsImage(false);
                } else if (contentType && contentType.startsWith('image')) {
                    setIsImage(true);
                } else {
                    throw new Error('Not a valid media file');
                }
                if (isMounted) { // Ensuring setState is called only if component is mounted
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error(error);
                if (isMounted) { // Ensuring setState is called only if component is mounted
                    setError('Failed to load media');
                    setIsLoading(false);
                }
            });

        // Cleanup function to set isMounted to false when unmounting
        return () => {
            isMounted = false;
            // Cleanup uri
            // Setting uri to an invalid or empty value to free up memory
            // Not recommended to set it to null
            // uri = ''; // Uncomment this line if you want to clear uri when unmounted
        };
    }, [uri]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (isImage) {
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: uri }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Video
                    source={{ uri: uri }}
                    style={styles.video}
                    resizeMode="contain"
                    shouldPlay
                    useNativeControls
                    isLooping
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    video: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default PlayVideo;
