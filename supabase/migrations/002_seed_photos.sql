-- supabase/migrations/002_seed_photos.sql
-- Sets cover images on service categories and seeds portfolio photos.
-- Image URLs reference /photos/* served from the Vercel public folder.

-- Cover images for service categories
UPDATE service_categories SET cover_image_url = '/photos/cabinetry.jpg'              WHERE name = 'Custom Furniture & Cabinetry';
UPDATE service_categories SET cover_image_url = '/photos/fence-and-landscaping.jpg'  WHERE name = 'Fencing & Landscaping';
UPDATE service_categories SET cover_image_url = '/photos/kitchen-remodel.jpg'        WHERE name = 'Home Additions & Remodels';
UPDATE service_categories SET cover_image_url = '/photos/built-in-entertainment-center.jpg' WHERE name = 'Finish Carpentry & Trim';
UPDATE service_categories SET cover_image_url = '/photos/commercial.jpg'             WHERE name = 'Full Construction Projects';
UPDATE service_categories SET cover_image_url = '/photos/table-restoration.jpg'      WHERE name = 'Repairs & Small Jobs';

-- Portfolio photos
INSERT INTO portfolio_photos (image_url, category_id, caption) VALUES
  ('/photos/cabinetry.jpg',                    (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Custom cabinetry'),
  ('/photos/custom-cabinet.jpg',               (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Custom cabinet'),
  ('/photos/custom-kitchen-cabs.jpg',          (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Custom kitchen cabinets'),
  ('/photos/custom-vanity-cabinet.jpg',        (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Custom vanity cabinet'),
  ('/photos/wine-cabinet.jpg',                 (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Wine cabinet'),
  ('/photos/slide-out-pantry.jpg',             (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Slide-out pantry'),
  ('/photos/built-in-entertainment-center.jpg',(SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Built-in entertainment center'),
  ('/photos/entertainment-wall.jpg',           (SELECT id FROM service_categories WHERE name = 'Custom Furniture & Cabinetry'), 'Entertainment wall'),
  ('/photos/fence-and-landscaping.jpg',        (SELECT id FROM service_categories WHERE name = 'Fencing & Landscaping'),   'Fence and landscaping'),
  ('/photos/kitchen.jpg',                      (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Kitchen'),
  ('/photos/kitchen-install.jpg',              (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Kitchen installation'),
  ('/photos/kitchen-remodel.jpg',              (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Kitchen remodel'),
  ('/photos/bathroom.jpg',                     (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Bathroom remodel'),
  ('/photos/process.jpg',                      (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Project in progress'),
  ('/photos/process-2.jpg',                    (SELECT id FROM service_categories WHERE name = 'Home Additions & Remodels'),   'Project in progress'),
  ('/photos/fireplace.jpg',                    (SELECT id FROM service_categories WHERE name = 'Full Construction Projects'),  'Fireplace build'),
  ('/photos/commercial.jpg',                   (SELECT id FROM service_categories WHERE name = 'Full Construction Projects'),  'Commercial project'),
  ('/photos/metal-work.jpg',                   (SELECT id FROM service_categories WHERE name = 'Full Construction Projects'),  'Metal work'),
  ('/photos/table-restoration.jpg',            (SELECT id FROM service_categories WHERE name = 'Repairs & Small Jobs'),       'Table restoration');
