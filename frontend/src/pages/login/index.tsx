import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { login } from '../../service/api';
import { API_ERROR_CODE } from '../../constant/api-error-code';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  display: block;
`;

// use .attrs method to add custom props to styled component
// and the hasError prop will not be add to the DOM element
const Input = styled.input.attrs<{ hasError?: boolean }>(props => ({
  hasError: props.hasError,
}))<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => (props.hasError ? 'red' : '#ccc')};
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Login: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Login successful');
      window.location.href = '/';
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response);
      const errorData = error.response;
      toast.error(errorData.error);
      if (errorData.error_code === API_ERROR_CODE.INVALID_USERNAME) {
        setUsernameError("Username doesn't exist");
        setPasswordError('');
      } else if (errorData.error_code === API_ERROR_CODE.INVALID_PASSWORD) {
        setPasswordError('Password is incorrect');
        setUsernameError('');
      } else {
        toast.error(error.response.data.error);
      }
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let invalid = false;
    if (!username) {
      setUsernameError('Username is required');
      invalid = true;
    } else {
      setUsernameError('');
    }
    if (!password) {
      setPasswordError('Password is required');
      invalid = true;
    } else {
      setPasswordError('');
    }
    if (invalid) {
      return;
    }
    mutation.mutate({username, password});
  };

  return (
    <PageContainer>
      <FormContainer>
        <FormTitle className='text-2xl font-bold'>Login</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Username:</Label>
            <Input type="text" name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              hasError={!!usernameError}
            />
            {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input type="password" name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={!!passwordError}
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </FormGroup>
          <Button type="submit">Login</Button>
        </Form>
      </FormContainer>
    </PageContainer>
  );
};
export default Login;