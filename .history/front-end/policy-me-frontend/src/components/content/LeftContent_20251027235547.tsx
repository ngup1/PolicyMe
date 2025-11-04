// Left content box component
import ContentBox from "@/components/ui/ContentBox";
import { AnalysisPanel } from "./AnalysisPanel";


export default function LeftContent() {
  return (
    <ContentBox title="Content Box 1asd">

      <p className="text-muted-foreground">Content will go here</p>
      <AnalysisPanel />


    </ContentBox>
  );
}

