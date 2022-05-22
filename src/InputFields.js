import React, { useEffect, useState } from 'react';

export default function InputFields() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);

  const baseUrl = 'http://localhost:4000';

  useEffect(() => {
    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const data = await response.json();

      setGuestList(data);
    }
    getGuestList().catch(() => {});
  }, []);

  // create New Guest

  async function newGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();

    setGuestList([...guestList, createdGuest]);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
  };

  // Update Guest
  async function updateAttendance(id, status) {
    const response = await fetch(`${baseUrl}/guests/${guestList.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: status }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);

    const guestListCopy = [...guestList];
    const findGuest = guestListCopy.find((guest) => guest.id === id);
    findGuest.attending = status;

    console.log(findGuest);

    setGuestList(guestListCopy);
    return updatedGuest;
  }
  // removing Guest

  function handleDelete(id) {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/guests/${guestList.id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
    }
    deleteGuest().catch((error) => {
      console.log(error);
    });
    const updatedList = guestList.filter((guest) => guest.id !== id);
    setGuestList(updatedList);
  }

  return (
    <div>
      {/* {JSON.stringify(guestList)} */}
      <h1>Guest List</h1>

      <form onSubmit={(e) => onSubmit(e)}>
        <label>
          {' '}
          First name
          <input
            onChange={(event) => setFirstName(event.currentTarget.value)}
            value={firstName}
          />
        </label>

        <label>
          {' '}
          Last name
          <input
            onChange={(event) => setLastName(event.currentTarget.value)}
            value={lastName}
          />
        </label>

        <button
          onClick={() => {
            newGuest();
          }}
        >
          Submit
        </button>
      </form>

      {/* {guestList.map((guest) => {
        return (<div key={guest.id}>{guest.firstName}<div/>)
      })} */}
      <br />
      <br />
      <br />
      <br />
      <br />
      {guestList.map((guest) => (
        <div key={guest.id}>
          <input
            checked={guest.attending}
            type="checkbox"
            onChange={(event) => {
              updateAttendance(guest.id, event.currentTarget.checked).catch(
                () => {},
              );
            }}
          />{' '}
          {guest.attending ? 'Attending' : 'Not attending'}| {guest.firstName}{' '}
          {guest.lastName}
          <button
            type="button"
            id="delete"
            onClick={() => handleDelete(guest.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
