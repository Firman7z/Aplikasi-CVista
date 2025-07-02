import { CVData, EducationEntry, WorkExperienceEntry } from '../types';
import { Packer, Document, Paragraph, TextRun, AlignmentType, Tab, TabStopType, TabStopPosition, PageBreak, PageNumber, Footer, Indent } from 'docx';
import saveAs from 'file-saver';

const formatDocxDate = (dateString: string, type: 'full' | 'monthYear' = 'full'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    if (typeof dateString === 'string' && dateString.toLowerCase() === 'present') return "Saat Ini";
    return dateString;
  }

  if (type === 'monthYear') {
    const [year, month] = dateString.split('-');
    if (year && month) {
      return new Date(parseInt(year), parseInt(month) - 1, 15).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
      });
    }
    return dateString;
  }
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', // Use 'numeric' for day instead of '2-digit' for more natural Indonesian date format
    month: 'long',
    year: 'numeric',
  });
};

const createLabelValueLine = (
    label: string, 
    value: string, 
    isBoldValue: boolean = false, 
    indentLeft?: number,
    labelWidthTwips: number = 2500 // Approx 1.7 inches
  ): Paragraph => {
  const children = [
    new TextRun({ text: label, font: "Calibri", size: 22 }), // 11pt
    new Tab(),
    new TextRun({ text: ": ", font: "Calibri", size: 22 }),
    new TextRun({ text: value || "", bold: isBoldValue, font: "Calibri", size: 22 }),
  ];
  
  return new Paragraph({
    children,
    tabStops: [
      { type: TabStopType.LEFT, position: labelWidthTwips }, 
      // Add a small tab after colon if needed, but usually space is enough
    ],
    indent: indentLeft ? { left: indentLeft } : undefined,
    style: "normalPara"
  });
};

const createSectionHeader = (text: string, spacingBefore: number = 200, spacingAfter: number = 100): Paragraph => {
    return new Paragraph({
        children: [new TextRun({ text: text, font: "Calibri", size: 22 })],
        spacing: { before: spacingBefore, after: spacingAfter },
        style: "normalPara"
    });
};


export const exportToDOCX = async (cvData: CVData, fileName: string = 'CV_Riwayat_Hidup.docx'): Promise<void> => {
  const { personalData, education, workExperience, languageProficiency } = cvData;

  const doc = new Document({
    creator: "CVista Smart CV Generator",
    title: "Daftar Riwayat Hidup",
    description: `Daftar Riwayat Hidup untuk ${personalData.fullName || 'Personil'}`,
    styles: {
      paragraphStyles: [
        {
          id: "normalPara",
          name: "Normal Para",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 22 }, // 11pt
          paragraph: { spacing: { after: 0, line: 240 } } // Default spacing for normal text
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 20 }),
              ],
            }),
          ],
        }),
      },
      children: [
        // No main title "DAFTAR RIWAYAT HIDUP" as per simplified user request.
        // The numbered list itself forms the CV.

        // 1. Posisi yang diusulkan
        createLabelValueLine("1. Posisi yang diusulkan", personalData.proposedPosition),
        // 2. Nama Perusahaan
        createLabelValueLine("2. Nama Perusahaan", personalData.lastCompany),
        // 3. Nama Personil
        createLabelValueLine("3. Nama Personil", personalData.fullName, true),
        // 4. Tempat/Tanggal Lahir
        createLabelValueLine("4. Tempat/Tanggal Lahir", `${personalData.placeOfBirth || ""}, ${formatDocxDate(personalData.dateOfBirth, 'full') || ""}`),
        
        // 5. Pendidikan (Formal)
        createSectionHeader("5. Pendidikan"),
        ...education.filter(edu => edu.isFormal).map(edu => new Paragraph({
            text: `- ${edu.degree || "[Gelar/Jurusan]"}, ${edu.institutionName || "[Institusi]"}, Lulus ${edu.graduationYear || "[Tahun Lulus]"}`,
            style: "normalPara",
            indent: { left: 360 }, // Indent list items
        })),
        ...(education.filter(edu => edu.isFormal).length === 0 ? [new Paragraph({ text: "- Tidak ada data pendidikan formal -", style: "normalPara", indent: { left: 360 }})] : []),

        // 6. Pendidikan Non Formal
        createSectionHeader("6. Pendidikan Non Formal"),
        ...education.filter(edu => !edu.isFormal).map(edu => new Paragraph({
            text: `- ${edu.degree || "[Nama Pelatihan]"}, ${edu.institutionName || "[Penyelenggara]"}, Selesai ${edu.graduationYear || "[Tahun Selesai]"}`,
            style: "normalPara",
            indent: { left: 360 },
        })),
        ...(education.filter(edu => !edu.isFormal).length === 0 ? [new Paragraph({ text: "- Tidak ada data pendidikan non-formal -", style: "normalPara", indent: { left: 360 }})] : []),

        // 7. Penguasaan Bahasa
        createSectionHeader("7. Penguasaan Bahasa"),
        createLabelValueLine("   a. Bahasa Indonesia", languageProficiency.indonesia || "N/A", false, 360, 2200),
        createLabelValueLine("   b. Bahasa Inggris", languageProficiency.inggris || "N/A", false, 360, 2200),
        createLabelValueLine("   c. Bahasa Setempat", languageProficiency.setempat || "N/A", false, 360, 2200),
        
        // 8. Pengalaman Kerja
        createSectionHeader("8. Pengalaman Kerja"),
        ...workExperience.flatMap((exp: WorkExperienceEntry, expIndex: number) => {
          const year = exp.startDate ? exp.startDate.substring(0, 4) : "TAHUN";
          return [
            new Paragraph({ 
                children: [new TextRun({ text: `Pengalaman ${expIndex + 1} (Tahun ${year})`, bold: true, font: "Calibri", size: 22 })],
                style: "normalPara",
                spacing: {before: (expIndex > 0 ? 200 : 50), after: 50},
                indent: {left: 360}
            }),
            createLabelValueLine("   a. Nama Kegiatan", exp.activityName || "N/A", false, 720),
            createLabelValueLine("   b. Lokasi", exp.location || "N/A", false, 720),
            createLabelValueLine("   c. Pengguna Jasa", exp.clientName || "N/A", false, 720),
            createLabelValueLine("   d. Nama Perusahaan", exp.companyName || "N/A", false, 720),
            new Paragraph({ // Label for Uraian Tugas
                children: [
                    new TextRun({ text: "   e. Uraian Tugas", font: "Calibri", size: 22 }),
                    new Tab(),
                    new TextRun({ text: ": ", font: "Calibri", size: 22 }),
                ],
                tabStops: [{ type: TabStopType.LEFT, position: 2200 + 360 }], // Match label width + indent
                style: "normalPara",
                indent: { left: 720 }
            }),
            ...(exp.responsibilities && exp.responsibilities.filter(r => r.trim() !== '').length > 0
                ? exp.responsibilities.filter(r => r.trim() !== '').map(resp => new Paragraph({ 
                    text: `- ${resp}`, 
                    style: "normalPara", 
                    indent: { left: 1080 + 360 } // Further indent for responsibilities list
                  }))
                : [new Paragraph({ text: "- Tidak ada uraian tugas spesifik -", style: "normalPara", indent: { left: 1080 + 360 }, run: {italics: true} })]
            ),
            createLabelValueLine("   f. Waktu Pelaksanaan", `${formatDocxDate(exp.startDate, 'monthYear')} s/d ${formatDocxDate(exp.endDate, 'monthYear')}`, false, 720),
            createLabelValueLine("   g. Posisi Penugasan", exp.jobTitle || "N/A", false, 720),
            createLabelValueLine("   h. Status Kepegawaian", exp.employmentStatus || "N/A", false, 720),
            createLabelValueLine("   i. Surat Referensi", exp.referenceInfo || "N/A", false, 720),
          ];
        }),
        ...(workExperience.length === 0 ? [new Paragraph({ text: "- Tidak ada pengalaman kerja -", style: "normalPara", indent: { left: 360 } })] : []),
        
        // Removed declaration and signature block as per simplified request
      ],
    }],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, fileName);
    console.log("Document created successfully (simplified format)");
  }).catch(err => {
    console.error("Error creating document: ", err);
    alert("Gagal membuat file DOCX. Silakan coba lagi.");
  });
};
