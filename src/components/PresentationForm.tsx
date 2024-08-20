import { useState } from "react";
import React from "react";
import { Button, Form } from "react-bootstrap";

const PresentationForm: React.FC = () => {
  const [presentation, setPresentation] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPresentation((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleOnSubmit} className="contact-form">
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          className="firstName"
          name="firstName"
          value={presentation.firstName}
          type="text"
          onChange={handleOnChange}
        />
      </Form.Group>
      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          className="lastName"
          name="lastName"
          value={presentation.lastName}
          type="text"
          onChange={handleOnChange}
        />
      </Form.Group>
      <Form.Group controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          className="phone"
          name="phone"
          value={presentation.phone}
          type="number"
          onChange={handleOnChange}
        />
      </Form.Group>
      <Form.Group controlId="submit">
        <Button variant="primary" type="submit" className="submit-btn">
          Add Presentation
        </Button>
      </Form.Group>
    </Form>
  );
};
export default PresentationForm;
