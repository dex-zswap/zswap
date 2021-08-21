export default function random(min, max): number {
  return Math.ceil(Math.random() * max - min)
}
