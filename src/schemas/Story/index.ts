export type StorySchemaV1 = {
  version: "1";
  id: string;
  title: string;
  paragraphGroups: StoryParagraphGroup[];
};

export type StoryParagraphGroup = {
  id: string;
  paragraphs: StoryParagraph[];
};

export type StoryParagraph = {
  id: string;
  lexicalString: string;
};

export type StoryBriefSchemaV1 = {
  version: "1";
  id: string;
  title: string;
  description: string;
};
