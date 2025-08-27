import { SettingsIcon } from "@/utils/icons";
import { Grid } from "@mantine/core";

export const DemoUtil = ({ text }: { text: string }): JSX.Element => (
  <Grid justify="center" className="flex-grow p-8">
    <Grid.Col span={4} className="mt-20 flex flex-col items-center">
      <div className="h-[150px] w-[150px] rounded-[50%] bg-[#e0e9f0] flex justify-center items-center">
        <SettingsIcon size={80} className="text-primary-darkest" />
      </div>
      <p className="uppercase text-primary-darkest text-2xl font-montserrat mt-4">
        {text}
      </p>
    </Grid.Col>
  </Grid>
);
