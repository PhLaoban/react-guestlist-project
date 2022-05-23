import React, { useEffect, useState } from 'react';

export default function InputFields() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = 'https://react-guest-list-philippanton.herokuapp.com';

  // getting all Guests

  useEffect(() => {
    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const data = await response.json();

      setGuestList(data);
      setLoading(false);
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
    setFirstName('');
    setLastName('');

    setGuestList([...guestList, createdGuest]);
  }

  // on Submit for Form
  const onSubmit = (event) => {
    event.preventDefault();
    if (!firstName || !lastName) {
      alert('PLEASE ENTER FULL NAME');
      return;
    }
  };

  // Update Guest

  function updateAttendance(id, status) {
    async function editGuest() {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
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
    editGuest().catch((error) => {
      console.log(error);
    });
  }
  // removing Guest

  function handleDelete(id) {
    async function deleteGuest() {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      console.log(deletedGuest);
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
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          placeholder="First Name"
          onChange={(event) => setFirstName(event.currentTarget.value)}
          value={firstName}
          disabled={loading ? 'disabled' : ''}
        />
        <label htmlFor="lastName">Last name</label>

        <input
          id="lastName"
          placeholder="Last Name"
          onChange={(event) => setLastName(event.currentTarget.value)}
          value={lastName}
          disabled={loading ? 'disabled' : ''}
        />
        <button
          onClick={() => {
            newGuest().catch(() => {});
          }}
        >
          Add guest
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
      {loading ? 'Loading...' : ''}
      {guestList.map((guest) => (
        <div
          data-test-id="guest"
          key={guest.id}
          className={guest.isChecked ? 'attending' : 'notAttending'}
        >
          <input
            aria-label="Guest Attending"
            checked={guest.attending}
            type="checkbox"
            onChange={(event) => {
              updateAttendance(guest.id, event.currentTarget.checked);
            }}
          />{' '}
          {guest.attending ? 'attending' : 'not attending'}| {guest.firstName}{' '}
          {guest.lastName}
          <button
            aria-label="Remove"
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
