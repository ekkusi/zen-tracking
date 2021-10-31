import { Marking } from "@prisma/client";
import { loaderResetors } from "../graphql/loaders";
import { CustomContext } from "../types/customContext";

export const deleteMarking = async (
  { prisma, s3Client, loaders }: CustomContext,
  marking: Marking
): Promise<boolean> => {
  const { id, photo_url } = marking;
  await loaderResetors.clearMarkingsCache(id, loaders);
  // This is temp solution, because prisma doesn't support NOT NULL constraint and ON DELETE CASCADE. Prisma delete results in relation delete violation.
  const deletedMarkings = await prisma.$executeRaw(
    `DELETE FROM "Marking" WHERE id='${id}';`
  );
  if (deletedMarkings > 0) {
    // If more than 0 rows are affected by above query -> marking deleted -> delete related photo from s3
    if (photo_url) {
      // If marking has photoUrl, try to delete it from aws
      try {
        await s3Client.deleteImage(photo_url);
      } catch (error) {
        console.log(
          `Couldn't delete marking ${marking.id} image: ${marking.photo_url} error: ${error.message}`
        );
      }
    }
    // Clear markingsLoader cache
    return true;
  }
  return false;
};
