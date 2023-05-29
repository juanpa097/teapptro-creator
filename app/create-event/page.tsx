"use client";

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import Image from 'next/image'
import { useState } from 'react';
import { firestore, storage } from '../services/FirebaseService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CreateEvent() {

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Upload the picture to Firebase Storage
      const storageRef = ref(storage, `pictures/${file.name}`);
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded picture
      const downloadURL = await getDownloadURL(storageRef);
      setPictureUrl(downloadURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can perform any necessary form submission logic here
    // For example, sending the data to a server or updating the state
    console.log({
      name,
      location,
      description,
      date,
      address,
      pictureUrl,
    });

    const event = {
      'name': name,
      'location_name': location,
      'description': description,
      'date': Timestamp.fromDate(new Date(date)),
      'address': address,
      'image_url': pictureUrl,
    }

    try {
      await addDoc(collection(firestore, 'events'), event);
    } catch (e: any) {
      console.log(e);
    }

    // Reset form fields
    setName('');
    setLocation('');
    setDescription('');
    setDate('');
    setAddress('');
    setPicture(null);
    setPictureUrl(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Picture:
          <input type="file" onChange={handlePictureUpload} />
        </label>
        <br />
        {pictureUrl && (
          <div>
            <img src={pictureUrl} alt="Uploaded" />
          </div>
        )}
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  )
}
