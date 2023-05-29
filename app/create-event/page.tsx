"use client";

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import Image from 'next/image'
import { useState } from 'react';
import { firestore } from '../services/FirebaseService';

export default function CreateEvent() {

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

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
    });

    const event = {
      'name': name,
      'location': location,
      'description': description,
      'date': Timestamp.fromDate(new Date(date)),
      'address': address,
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
        <button type="submit">Create Event</button>
      </form>
    </div>
  )
}
