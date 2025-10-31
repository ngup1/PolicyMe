// Left content box component
import ContentBox from "@/components/ui/ContentBox";
import { AnalysisPanel } from "./AnalysisPanel";

export default function LeftContent() {
  return (
    <ContentBox title="Policy Analysis">
      <AnalysisPanel />
    </ContentBox>
  );
}