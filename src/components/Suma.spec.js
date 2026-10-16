import { render } from "@testing-library/react";
import Suma from "./Suma";

describe('Componente Suma', () => {
    it('Muestra el resultado de 2 + 3', () => {
        const {container} = render(<Suma />);
        expect(container.textContent).toBe('5');
    })
} );