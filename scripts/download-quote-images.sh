#!/bin/bash

# instagram-scraper motivaatiolauseet --latest -d modules/frontend/public/photos/quotes

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd $parent_path/../modules/frontend/public # Go to frontend public folder

echo "Removing existing photos in /modules/frontend/public/photos/quotes"
rm -rf photos/quotes
echo "Fetching photos from motivaatiolauseet's Instagram account"
instagram-scraper motivaatiolauseet -d photos/quotes
cd photos/quotes # Go to the created/updated quotes photos folder

echo "Renaming photos to be numbered to format: \"quote-i.jpg\""
i=1
for file in *.jpg
do
  mv "$file" "quote-${i}.jpg"
  let i=i+1
done

cd ../../../src/ # Go to frontend src folder
photo_count=$(( $i - 1 ))

echo "Changing config.json NUMBER_OF_QUOTE_PHOTOS count to ${photo_count}"
perl -i -pe"s/\"NUMBER_OF_QUOTE_PHOTOS\":.*/\"NUMBER_OF_QUOTE_PHOTOS\": ${photo_count},/" config.json
