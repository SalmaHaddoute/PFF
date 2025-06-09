import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';

const StatusPage = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.user_type === 'entreprise' && user?.status === 'accepte') {
    return <Navigate to="/entreprise/dashboard" replace />;
  }

  if (!location.state?.registrationSuccess && !user) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100" 
      style={{
        width: '100%'
      }}
    >
      <Container className="py-5 d-flex justify-content-center">
        <div 
          className="p-4 rounded shadow-sm bg-white" 
          style={{ 
            maxWidth: '600px',
            width: '100%'
          }}
        >
          <h2 className="mb-4 text-primary text-center">Account Status</h2>
          
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <Spinner animation="border" variant="info" className="me-3" />
              <div>
                <Alert.Heading>Your Account is Pending Approval</Alert.Heading>
                <p className="mb-0">
                  Status: <strong className="text-warning">En attente</strong>
                </p>
              </div>
            </div>
            <hr />
            <p className="mb-0">
              We've received your registration and our team is reviewing your application.
              You'll receive an email notification once your account is approved.
            </p>
          </Alert>

          <div className="d-flex justify-content-center gap-3 mb-3">
           <Link to="/"> <Button 
              variant="primary" 
              
              className="px-4 py-2"
            >
              Return Home
            </Button></Link>
            <Button 
              variant="outline-primary" 
             
              className="px-4 py-2"
            >
              Contact Support
            </Button>
          </div>

          {location.state?.message && (
            <div className="mt-3 text-center text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              {location.state.message}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default StatusPage;