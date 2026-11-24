import {collection, doc, setDoc, getDocs, getDoc, deleteDoc, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase/firebase";

const getMyListCollection = (userId) => {
    return collection(db, "users", userId, "myList");
};

export const addToMyList = async (userId, movie, mediaType = "movie") => {
    const itemId = `${mediaType}_${movie.id}`;
    const itemRef = doc( db, "users", userId, "myList", itemId);
    const itemData = {
        id: movie.id,
        mediaType,
        title: movie.title || movie.name || "Untitled",
        overview: movie.overview || "",
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        vote_average: movie.vote_average ?? null,
        release_date: movie.release_date || null,
        first_air_date: movie.first_air_date || null,
        addedAt: serverTimestamp()
    };
    await setDoc(itemRef, itemData);
};

export const getMyList = async (userId) => {
    const querySnapshot = await getDocs(
        getMyListCollection(userId)
    );
    return querySnapshot.docs.map((document) => ({ ...document.data(), documentId: document.id}));
};

export const removeFromMyList = async (userId, itemId) => {
    const itemRef = doc( db, "users", userId, "myList", itemId);
    await deleteDoc(itemRef);
};

export const isInMyList = async (userId, movieId, mediaType) => {
    const itemId = `${mediaType}_${movieId}`;
    const itemRef = doc( db, "users", userId, "myList", itemId);
    const documentSnapshot = await getDoc(itemRef);
    return documentSnapshot.exists();
};