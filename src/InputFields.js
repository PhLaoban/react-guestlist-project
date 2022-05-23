/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const background = css`
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(121, 59, 9, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  height: 2000px;
  width: auto;

  background-repeat: no-repeat;

  /* background: orange; */
`;

const inputFields = css`
  input {
    font-family: 'Poiret One';
    color: white;
    font-weight: bolder;
    font-size: 1.8rem;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    border-radius: 0.2rem;
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(121, 59, 9, 1) 35%,
      rgba(0, 212, 255, 1) 100%
    );
    opacity: 0.7;
    border: none;
    width: 30%;
    display: block;
    border-bottom: 0.3rem solid transparent;
    transition: all 0.3s;
  }
`;

const button = css`
  width: 220px;
  height: 60px;
  border-color: white;
  background-color: var(--light-theme);
  cursor: pointer;
  font-size: 24px;
  color: var(--color);
  transition: all 0.3s;

  text-align: center;
  overflow: hidden;

  border-radius: 5px;
  box-shadow: 0 6px 30px -10px rgba(#cccccc, 1);

  &:hover {
    transform: translateX(5px) translateY(-7px);
  }
`;
const removeButtonField = css`
  display: flex;
  max-width: 800px;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
`;

const checkbox = css`
  width: 15px;
  height: 15px;
  border-radius: 5px;
  border: 2px solid #8cad2d;
  background-color: #fff;
  display: block;
  content: '';
  float: left;
  margin-right: 5px;
  z-index: 5;
  position: relative;
`;

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
      <div css={background}>
        <br />
        <br />
        <h1>Guest List</h1>

        <form onSubmit={(e) => onSubmit(e)}>
          <div css={inputFields}>
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
            />{' '}
          </div>
          <br />
          <button
            css={button}
            style={{ fontFamily: 'Poiret One', fontWeight: 'bolder' }}
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
        {loading ? 'Loading...' : ''}
        {guestList.map((guest) => (
          <div
            data-test-id="guest"
            key={guest.id}
            className={guest.isChecked ? 'attending' : 'notAttending'}
          >
            {' '}
            <div css={removeButtonField}>
              <input
                css={checkbox}
                aria-label="Guest Attending"
                checked={guest.attending}
                type="checkbox"
                onChange={(event) => {
                  updateAttendance(guest.id, event.currentTarget.checked);
                }}
              />{' '}
              {guest.firstName} {guest.lastName}{' '}
              {guest.attending ? 'is attending' : 'is not attending'}{' '}
              <button
                css={button}
                aria-label="Remove"
                type="button"
                id="delete"
                onClick={() => handleDelete(guest.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
