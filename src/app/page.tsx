import { Container } from 'react-bootstrap'
import Header from './components/Header'

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Container>
          <h1>Body</h1>
        </Container>
      </main>
    </div>
  );
}
