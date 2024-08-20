import { useState } from "react";
import React from "react";
import { Button, Form } from "react-bootstrap";



const PresentationForm: React.FC = () => {
  const [presentation, setPresentation] = useState({
    title: "",
    authors: "",
    slides: "",
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
        <Form.Label>Title</Form.Label>
        <Form.Control
          className="firstName"
          name="firstName"
          value={presentation.title}
          type="text"
          onChange={handleOnChange}
        />
      </Form.Group>
      <Form.Group controlId="lastName">
        <Form.Label>Authors</Form.Label>
        <Form.Control
          className="lastName"
          name="lastName"
          value={presentation.authors}
          type="text"
          onChange={handleOnChange}
        />
      </Form.Group>
      <Form.Group controlId="phone">
        <Form.Label>Slides</Form.Label>
        <Form.Control
          className="phone"
          name="phone"
          value={presentation.slides}
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
