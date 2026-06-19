import React, { useState, useEffect } from 'react';

// Cambia tus líneas 3, 4 y 5 por esto:
import Display from './Display/Display';
import ButtonPad from './ButtonPad/ButtonPad';
import History from './History/History';

// Cambia tu línea 7 (subiendo solo un nivel para llegar a types):
import type { Operator, Operation } from '../../types/Calculator';

import styles from './Calculator.module.css';

const Calculator: React.FC = () => {

  // ==========================
  // ESTADOS
  // ==========================

  const [display, setDisplay] = useState<string>('0');

  const [previousValue, setPreviousValue] =
    useState<number | null>(null);

  const [currentOperator, setCurrentOperator] =
    useState<Operator | null>(null);

  const [isNewNumber, setIsNewNumber] =
    useState<boolean>(true);

  const [history, setHistory] =
    useState<Operation[]>([]);

  const [operationCount, setOperationCount] =
    useState<number>(0);

  // ==========================
  // CONSTANTES
  // ==========================

  const MAX_DIGITS = 12;
  const MAX_HISTORY = 5;

  // ==========================
  // useEffect
  // Limitar a 12 dígitos
  // ==========================

  useEffect(() => {

    if (
      display.length > MAX_DIGITS &&
      !isNewNumber
    ) {
      setDisplay(
        display.slice(0, MAX_DIGITS)
      );
    }

  }, [display, isNewNumber]);

  // ==========================
  // NÚMEROS
  // ==========================

  const handleNumber = (
    num: string
  ): void => {

    if (isNewNumber) {

      setDisplay(num);

      setIsNewNumber(false);

    } else {

      if (
        num === '.' &&
        display.includes('.')
      ) {
        return;
      }

      setDisplay(display + num);
    }
  };

  // ==========================
  // OPERADORES
  // ==========================

  const handleOperator = (
    operator: Operator
  ): void => {

    const currentValue =
      parseFloat(display);

    if (previousValue === null) {

      setPreviousValue(
        currentValue
      );

    } else if (currentOperator) {

      const result = calculate(
        previousValue,
        currentValue,
        currentOperator
      );

      setDisplay(
        result.toString()
      );

      setPreviousValue(result);
    }

    setCurrentOperator(
      operator
    );

    setIsNewNumber(true);
  };

  // ==========================
  // CALCULAR
  // ==========================

  const calculate = (
    prev: number,
    current: number,
    operator: Operator
  ): number => {

    switch (operator) {

      case '+':
        return prev + current;

      case '-':
        return prev - current;

      case '*':
        return prev * current;

      case '/':

        if (current === 0) {

          alert(
            '⚠️ Error: No se puede dividir entre cero'
          );

          return prev;
        }

        return prev / current;

      default:
        return current;
    }
  };

  // ==========================
  // IGUAL
  // ==========================

  const handleEquals = (): void => {

    if (
      previousValue !== null &&
      currentOperator
    ) {

      const currentValue =
        parseFloat(display);

      const result =
        calculate(
          previousValue,
          currentValue,
          currentOperator
        );

      const roundedResult =
        Math.round(
          result * 100
        ) / 100;

      setDisplay(
        roundedResult.toString()
      );

      const newOperation: Operation = {

        id: operationCount + 1,

        expression:
          `${previousValue} ${currentOperator} ${currentValue}`,

        result: roundedResult,

        timestamp:
          new Date()
      };

      setHistory(
        (prev) =>
          [newOperation, ...prev]
            .slice(
              0,
              MAX_HISTORY
            )
      );

      setOperationCount(
        (prev) => prev + 1
      );

      setPreviousValue(null);

      setCurrentOperator(null);

      setIsNewNumber(true);
    }
  };

  // ==========================
  // CLEAR
  // ==========================

  const handleClear = (): void => {

    setDisplay('0');

    setPreviousValue(null);

    setCurrentOperator(null);

    setIsNewNumber(true);
  };

  // ==========================
  // BACKSPACE
  // ==========================

  const handleBackspace = (): void => {

    if (display.length === 1) {

      setDisplay('0');

      setIsNewNumber(true);

    } else {

      setDisplay(
        display.slice(0, -1)
      );
    }
  };

  // ==========================
  // PORCENTAJE
  // ==========================

  const handlePercentage = (): void => {

    const value =
      parseFloat(display) / 100;

    setDisplay(
      value.toString()
    );
  };

  // ==========================
  // RENDER
  // ==========================

  return (

    <div className={styles.container}>

      <div
        className={
          styles.calculatorWrapper
        }
      >

        <h1
          className={styles.title}
        >
          🧮 Calculadora
        </h1>

        <Display
          value={display}
        />

        <ButtonPad
          onNumber={handleNumber}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onClear={handleClear}
          onBackspace={
            handleBackspace
          }
          onPercentage={
            handlePercentage
          }
        />

      </div>

      {history.length > 0 && (

        <History
          operations={history}
        />

      )}

    </div>
  );
};

export default Calculator;