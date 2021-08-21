import random from 'utils/random'

export default function useRandomNumbers(lens: number): number[][] {
  const numberWrappArray: number[][] = []
  let numbers: number[] = []
  let randomNumber: number | undefined

  for (let l = 0; l < lens; l++) {
    numbers = []

    for (let i = 0; i < 6; i++) {
      randomNumber = random(0, 9)

      while (numbers.includes(randomNumber)) {
        randomNumber = random(0, 9)
      }

      numbers.push(randomNumber)
    }

    numberWrappArray.push(numbers)
  }

  return numberWrappArray
}
