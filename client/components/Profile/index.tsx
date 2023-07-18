import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import Loader from '../Loader';
import Message from '../Message';
import {
  useAuth,
  useTypedSelector,
  useUserActions,
} from '../../hooks';
import { UserCredentials } from '../../interfaces';

const Profile = () => {
  useAuth();

  const initialCredentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const userData = useTypedSelector(state => state.user.data);
  const { error, loading, success } = useTypedSelector(
    state => state.userUpdate
  );

  const { updateUser } = useUserActions();

  const [credentials, setCredentials] =
    useState<UserCredentials>(initialCredentials);
  const [message, setMessage] = useState<string | null | string[]>(error);

  useEffect(() => {
    setMessage(error);
  }, [error]);

  useEffect(() => {
    if (userData) {
      setCredentials(credentials => ({
        ...credentials,
        name: userData.name,
        email: userData.email,
      }));
    }
  }, [userData]);

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = credentials;

    if (name.length < 1 && email.length < 1 && password.length < 1) {
      setMessage('Change at least one property.');

      return null;
    }

    if (password.length > 0 && password !== confirmPassword) {
      setMessage('Passwords do not match');

      return null;
    }

    setMessage(null);

    updateUser({
      name: name.length > 0 ? name : undefined,
      email: email.length > 0 ? email : undefined,
      password: password.length > 0 ? password : undefined,
    });
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        {message && (
          <Message variant="danger">
            {Array.isArray(message) ? message[0] : message}
          </Message>
        )}
        {success && !error && (
          <Message variant="success">Profile Updated</Message>
        )}
        {loading && <Loader />}

        <Form onSubmit={onSubmitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={credentials.name}
              onChange={e =>
                setCredentials({ ...credentials, name: e.target.value })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="py-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={credentials.email}
              onChange={e =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={e =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="py-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={credentials.confirmPassword}
              onChange={e =>
                setCredentials({
                  ...credentials,
                  confirmPassword: e.target.value,
                })
              }
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Profile;
