import RoomRenderer from "../_components"

type Props = {
  params: Promise<{
    code: string
  }>
}
const Page = async ({ params }: Props) => {
  const { code } = await params;
  return (
    <RoomRenderer />
  )
}

export default Page