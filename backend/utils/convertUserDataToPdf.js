import PDFDocument from "pdfkit";
import crypto from "crypto";
import { s3 } from "../config/cloudflare-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const convertUserDataToPdf = async (userData) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    const chunks = [];

    const pdfPromise = new Promise((resolve, reject) => {
        doc.on("data", (chunk) => chunks.push(chunk));

        doc.on("end", async () => {
            try {
                const pdfBuffer = Buffer.concat(chunks);

                const fileName = `${crypto.randomUUID()}.pdf`;
                const key = `resumes/${fileName}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET,
                    Key: key,
                    Body: pdfBuffer,
                    ContentType: "application/pdf",
                });

                await s3.send(command);

                resolve({
                    url: `${process.env.R2_PUBLIC_URL}/${key}`,
                    key
                });

            } catch (err) {
                reject(err);
            }
        });

        doc.on("error", reject);
    });


    // PROFILE IMAGE
    const startY = 50;

    if (userData.userId?.profilePicture) {
        try {
            const response = await fetch(userData.userId.profilePicture);
            const imageBuffer = await response.arrayBuffer();

            doc.image(Buffer.from(imageBuffer), 50, startY, {
                width: 80,
                height: 80,
                fit: [80, 80],
            });
        } catch (err) {
            console.log("Image load Failed!");
        }
    }


    const textStartX = 150;

    doc.fontSize(20)
        .fillColor("#000")
        .text(userData.userId?.name || "", textStartX, startY);

    doc.fontSize(12)
        .fillColor("gray")
        .text(userData.userId?.email || "", textStartX, startY + 25);

    if (userData.city) {
        doc.text(userData.city, textStartX, startY + 40);
    }


    // Divider
    doc.moveTo(50, startY + 110).lineTo(550, startY + 110).stroke();

    doc.x = 50;
    doc.y = startY + 130;

    // ABOUT

    if (userData.bio) {
        doc.fontSize(14).fillColor("#000").text("About Me", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text(userData.bio);
        doc.moveDown();
    }


    // CURRENT POSITION

    if (userData.currentPost) {
        doc.fontSize(14).text("Current Position", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text(userData.currentPost);
        doc.moveDown();
    }


    // TOP SKILLS

    if (userData.topSkills?.length > 0) {
        doc.fontSize(14).text("Top Skills", { underline: true });
        doc.moveDown(0.5);

        doc.font("Helvetica-Bold").text(userData.topSkills.join(" • "));
        doc.font("Helvetica");

        doc.moveDown();
    }


    // SKILLS 

    if (userData.skills?.length > 0) {
        doc.fontSize(14).text("Skills", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12);

        userData.skills.forEach((skill) => {
            doc.text(`• ${skill.name}`); // ✅ no time
        });

        doc.moveDown();
    }


    // EXPERIENCE
    if (userData.experience?.length > 0) {
        doc.fontSize(14).text("Work Experience", { underline: true });
        doc.moveDown(0.5);

        userData.experience.forEach((work) => {
            doc.fontSize(12).fillColor("#000")
                .text(`${work.position} at ${work.company}`);

            doc.fontSize(10).fillColor("gray")
                .text(`${work.years} yrs | ${work.mode || ""} | ${work.location || ""}`);

            doc.moveDown(0.5);
        });

        doc.moveDown();
    }

    // EDUCATION
    if (userData.education?.length > 0) {
        doc.fontSize(14).text("Education", { underline: true });
        doc.moveDown(0.5);

        userData.education.forEach((edu) => {
            doc.fontSize(12).fillColor("#000")
                .text(`- ${edu.degree} in ${edu.fieldOfStudy}`);

            doc.fontSize(10).fillColor("gray")
                .text(edu.school);

            doc.moveDown(0.5);
        });

        doc.moveDown();
    }

    // LANGUAGES
    if (userData.languages?.length > 0) {
        doc.fontSize(14).text("Languages", { underline: true });
        doc.moveDown(0.5);

        userData.languages.forEach((lang) => {
            doc.fontSize(12).text(`• ${lang.name} (${lang.level})`);
        });

        doc.moveDown();
    }


    doc.end();

    return pdfPromise;
};

export default convertUserDataToPdf;