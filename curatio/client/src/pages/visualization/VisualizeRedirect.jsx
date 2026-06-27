import { Navigate, useParams } from 'react-router-dom';

const VisualizeRedirect = () => {
  const { step } = useParams();
  return <Navigate to={`/visualization/${step || '1'}`} replace />;
};

export default VisualizeRedirect;
