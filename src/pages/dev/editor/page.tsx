import { Card } from "react-daisyui";

import BahaStoryParagraphEditor from "../../../components/BahaStoryParagraphEditor";

export default function DevEditorPage() {
  return (
    <div className="container mx-auto">
      <Card className="bg-slate-300">
        <Card.Body>
          <BahaStoryParagraphEditor id="1" />
        </Card.Body>
      </Card>
    </div>
  );
}
