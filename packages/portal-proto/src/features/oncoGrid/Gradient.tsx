import { useMantineTheme, ColorSwatch } from "@mantine/core";

interface GradientProps {
  readonly color: string;
}

const Gradient: React.FC<GradientProps> = ({ color }: GradientProps) => {
  const theme = useMantineTheme();
  return (
    <div className="flex flex-row">
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(color, 0.95)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(color, 0.6)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(color, 0.3)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={color} />
      </div>
    </div>
  );
};

export default Gradient;
